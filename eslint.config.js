import mercadonaPlugin from '@mercadona/eslint-plugin';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  ...mercadonaPlugin.configs.recommended,
  {
    ignores: ['src/app/api/**', 'src/main.ts', 'src/app/app.config.ts']
  },
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: ['tsconfig.eslint.json']
      }
    },
    rules: {}
  },
  {
    files: ['src/**/*.spec.ts'],
    languageOptions: {
      parserOptions: {
        project: ['tsconfig.spec.json']
      }
    }
  },
  {
    files: ['src/**/*.html'],
    rules: {}
  },
  {
    files: ['src/**/*.js'],
    rules: {}
  },
  {
    files: ['src/**/*.mocks.ts', 'src/**/*.mock.ts'],
    rules: {}
  },
  {
    files: ['src/**/*inline-template-*.component.html'],
    rules: {}
  }
]);
