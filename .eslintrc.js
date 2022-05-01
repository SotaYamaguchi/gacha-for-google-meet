module.exports = {
  env: {
    browser: true,
    webextensions: true,
    commonjs: true,
    es2021: true
  },
  extends: [
    'plugin:react/recommended',
    'standard'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 'latest'
  },
  plugins: [
    'react',
    '@typescript-eslint'
  ],
  rules: {
  }
}
