module.exports = {
  root: true,
  env: {
    node: true,
    jest: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
    project: './tsconfig.test.json',
  },
  plugins: [
    'jest',
    '@typescript-eslint'
  ],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:jest/recommended',
    'airbnb-typescript/base',
    'plugin:prettier/recommended'
  ],
  settings: {
    'import/resolver': {
      typescript: {}, // this loads <rootdir>/tsconfig.json to eslint
    },
  },
  rules: {
    "@typescript-eslint/indent": ["error", 2],
    "import/export": 1,
    "import/prefer-default-export": 1
  }
};
