import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from "rollup-plugin-terser";
import postcss from 'rollup-plugin-postcss'

export default {
  input: 'src/main.js',
  plugins: [
    resolve(),
    commonjs(),
    postcss({
      inject: false,
      extract: 'style.css',
    }),
    babel({ babelHelpers: 'bundled' }),
  ],
  output: [{
    file: 'docs/bundle.js',
    format: 'iife',
  }, {
    file: 'docs/bundle.min.js',
    format: 'iife',
    plugins: [terser()],
  }]
};
