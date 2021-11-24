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

export default {
  input: 'src/main.js',
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
        delay: 1000,
      }),
  ],
  output: [
    {
      file: 'docs/bundle.js',
      format: 'iife',
    },
    {
      file: 'docs/bundle.min.js',
      format: 'iife',
      plugins: [terser()],
    },
  ],
};
