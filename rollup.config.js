import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';

export default {
  input: 'src/main.js',
  plugins: [
    resolve(),
    babel({ babelHelpers: 'bundled' })
  ],
  output: {
    file: 'docs/bundle.js',
    format: 'iife'
  }
};
