module.exports = {
  env: {
    es6: true,
    browser: true,
    jest: true,
  },
  extends: '@passive-income/eslint-config',
  settings: {
    'import/resolver': {
      node: {
        moduleDirectory: ['src'],
      },
    },
  },
  rules: {
    'no-console': ['warn', { allow: ['info', 'warn', 'error'] }],
    'no-plusplus': 0,
    'no-nested-ternary': 0,
    'prefer-destructuring': ['warn', { object: true, array: false }],
    'no-underscore-dangle': 0,
    'react/require-default-props': 0,
    'react/default-props-match-prop-types': 0,
    '@typescript-eslint/ban-ts-comment': [1, { 'ts-ignore': true, 'ts-nocheck': false }],
    '@typescript-eslint/no-use-before-define': 0,
    '@typescript-eslint/explicit-module-boundary-types': 0,
    '@typescript-eslint/no-explicit-any': 0,
    radix: 0,
    'import/no-extraneous-dependencies': 0,
    'jsx-a11y/media-has-caption': 0,
    'jsx-a11y/label-has-associated-control': [
      'error',
      {
        required: {
          some: ['nesting', 'id'],
        },
      },
    ],
    'jsx-a11y/label-has-for': [
      'error',
      {
        required: {
          some: ['nesting', 'id'],
        },
      },
    ],
    // End temporary rules
  },
}
