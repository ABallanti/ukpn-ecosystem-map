module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['standard'],
  ignorePatterns: ['docs/**'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    semi: ['error', 'always'],
    'comma-dangle': ['error', 'always-multiline'],
  },
};
