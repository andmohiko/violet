import js from '@eslint/js';
import parser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import react from 'eslint-plugin-react';
import prettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';

export default [
  js.configs.recommended,
  prettier,
  {
    files: ['apps/**/*.{ts,tsx,js,jsx}'], // ← apps以下のみ
    languageOptions: {
      parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      react: react,
      import: importPlugin,
    },
    rules: {
      'prefer-const': 'error',
      'prefer-arrow-callback': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        { prefer: 'type-imports' },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { varsIgnorePattern: '^_', argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'variable',
          format: ['strictCamelCase', 'StrictPascalCase', 'UPPER_CASE'],
          leadingUnderscore: 'allow',
        },
        { selector: 'parameter', format: ['strictCamelCase'] },
        {
          selector: 'class',
          format: ['StrictPascalCase'],
          custom: { regex: 'send|start|find', match: false },
        },
        { selector: 'typeLike', format: ['StrictPascalCase'] },
        { selector: 'enumMember', format: ['StrictPascalCase'] },
        {
          selector: 'variable',
          types: ['boolean'],
          format: ['PascalCase'],
          prefix: ['is', 'can', 'should', 'has', 'did', 'will'],
        },
      ],
      '@typescript-eslint/array-type': ['error', { default: 'generic' }],
      'import/order': [
        'error',
        { 'newlines-between': 'always', warnOnUnassignedImports: true },
      ],
      'no-restricted-imports': ['error', { patterns: ['../'] }],
      curly: ['error', 'all'],
      'object-shorthand': ['error', 'always'],
      'no-nested-ternary': 'error',
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'react/react-in-jsx-scope': 'off',
      'react/jsx-filename-extension': [
        'error',
        { extensions: ['.jsx', '.tsx'] },
      ],
      'react/prop-types': 'off',
      'react/jsx-pascal-case': 'error',
      'react/self-closing-comp': 'error',
      'react/jsx-curly-brace-presence': 'error',
    },
  },
];
