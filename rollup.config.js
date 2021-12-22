import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import cssnano from 'cssnano';
import livereload from 'rollup-plugin-livereload';
import postcss from 'rollup-plugin-postcss';
import serve from 'rollup-plugin-serve';
import { terser } from 'rollup-plugin-terser';
import autoprefixer from 'autoprefixer';

const dev = process.env.NODE_ENV === 'development';

const output = [
  {
    file: 'docs/bundle.js',
    format: 'iife',
  },
  !dev && {
    file: 'docs/bundle.min.js',
    format: 'iife',
    plugins: [terser()],
  },
].filter(x => x);

export default {
  onwarn: function (warning, warn) {
    const modulesWithCircularDependencies = ['d3-selection', 'd3-interpolate', 'd3-transition'];
    if (
      warning.code === 'CIRCULAR_DEPENDENCY' &&
      warning.importer.match(new RegExp(modulesWithCircularDependencies.join('|')))
    )
      return;
    warn(warning);
  },
  input: 'src/main.js',
  output,
  plugins: [
    resolve(),
    commonjs(),
    postcss({
      inject: false,
      extract: 'style.css',
      plugins: [
        autoprefixer(),
        cssnano({
          preset: 'default',
        }),
      ],
    }),
    babel({ babelHelpers: 'bundled' }),
    dev &&
      serve({
        contentBase: 'docs',
        open: true,
      }),
    dev &&
      livereload({
        watch: 'docs',
        delay: 2000,
      }),
  ],
};
