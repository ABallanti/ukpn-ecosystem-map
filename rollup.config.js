import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from "rollup-plugin-terser";

export default {
  input: 'src/main.js',
  plugins: [
    resolve(),
    commonjs(),
    babel({ babelHelpers: 'bundled' }),
  ],
  output: [{
    file: 'docs/bundle.js',
    format: 'iife'
  }, {
    file: 'docs/bundle.min.js',
    format: 'iife',
    plugins: [terser()],
  }]
};
