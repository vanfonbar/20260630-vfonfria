// File patterns for different types of files
const tsPattern = '*.ts';
const specPattern = '*.spec.ts';
const htmlPattern = '*.html';
const inlineHtmlPattern = '*inline-template-*.component.html';
const jsPattern = 'src/**/*.js';
const jsFilesPattern = '**/*.js';
const mockPatterns = ['*.mocks.ts', '*.mock.ts'];

module.exports = {
  root: true,
  plugins: ['@mercadona/eslint-plugin'],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module'
  },
  overrides: [
    // TypeScript source files (excluding tests and JavaScript files)
    {
      files: [tsPattern],
      excludedFiles: [specPattern, jsFilesPattern],
      extends: ['plugin:@mercadona/eslint-plugin/ts', 'plugin:@mercadona/eslint-plugin/jsdoc'],
      parserOptions: {
        ecmaVersion: 2022,
        project: ['tsconfig.eslint.json']
      },
      rules: {}
    },
    // TypeScript test files (*.spec.ts)
    {
      files: [specPattern],
      extends: ['plugin:@mercadona/eslint-plugin/ts', 'plugin:@mercadona/eslint-plugin/spec'],
      parserOptions: {
        ecmaVersion: 2022,
        project: ['tsconfig.spec.json']
      },
      rules: {}
    },
    // HTML template files
    {
      files: [htmlPattern],
      extends: ['plugin:@mercadona/eslint-plugin/html'],
      rules: {}
    },
    // Inline HTML templates (component inline templates)
    {
      files: [inlineHtmlPattern],
      extends: ['plugin:@mercadona/eslint-plugin/inline-html'],
      rules: {}
    },
    // JavaScript files in src directory
    {
      files: [jsPattern],
      extends: ['plugin:@mercadona/eslint-plugin/js', 'plugin:@mercadona/eslint-plugin/jsdoc'],
      rules: {}
    },
    // Mock files (*.mocks.ts, *.mock.ts)
    {
      files: mockPatterns,
      extends: ['plugin:@mercadona/eslint-plugin/mocks'],
      rules: {}
    }
  ]
};
