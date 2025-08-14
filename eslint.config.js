// eslint.config.js
const { FlatCompat } = require('@eslint/eslintrc')
const { defineConfig } = require('eslint/config')
const tsParser = require('@typescript-eslint/parser')
const globals = require('globals')
const simpleImportSort = require('eslint-plugin-simple-import-sort')
const prettier = require('eslint-plugin-prettier')
const cypress = require('eslint-plugin-cypress')
const js = require('@eslint/js')

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

module.exports = defineConfig([
  // Spread the extended configurations directly into the array
  ...compat.extends(
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:prettier/recommended',
    'plugin:cypress/recommended',
  ),

  {
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2020,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.amd,
        ...globals.node,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    // The plugins object should be defined here for any additional plugins
    // that don't have a configuration you're extending.
    // In this case, 'simple-import-sort' is the only one.
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'prettier/prettier': ['error', {}, { usePrettierrc: true }],
      'react/react-in-jsx-scope': 'off',
      'jsx-a11y/accessible-emoji': 'off',
      'jsx-a11y/click-events-have-key-events': 'off',
      'jsx-a11y/no-static-element-interactions': 'off',
      'react/prop-types': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'jsx-a11y/anchor-is-valid': [
        'error',
        {
          components: ['Link'],
          specialLink: ['hrefLeft', 'hrefRight'],
          aspects: ['invalidHref', 'preferButton'],
        },
      ],
      'no-unused-vars': ['error', { args: 'none' }],
    },
  },
])
