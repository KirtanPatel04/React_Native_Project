module.exports = {
  root: true,
  extends: ['@react-native/eslint-config', 'eslint:recommended'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  env: {
    node: true,
  },
  rules: {
    'react/react-in-jsx-scope': 'off'
  },
};
