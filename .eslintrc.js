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
    {
      files: [specPattern],
      extends: ['plugin:@mercadona/eslint-plugin/ts', 'plugin:@mercadona/eslint-plugin/spec'],
      parserOptions: {
        ecmaVersion: 2022,
        project: ['tsconfig.spec.json']
      },
      rules: {}
    },
    {
      files: [htmlPattern],
      extends: ['plugin:@mercadona/eslint-plugin/html'],
      rules: {}
    },
    {
      files: [inlineHtmlPattern],
      extends: ['plugin:@mercadona/eslint-plugin/inline-html'],
      rules: {}
    },
    {
      files: [jsPattern],
      extends: ['plugin:@mercadona/eslint-plugin/js', 'plugin:@mercadona/eslint-plugin/jsdoc'],
      rules: {}
    },
    {
      files: mockPatterns,
      extends: ['plugin:@mercadona/eslint-plugin/mocks'],
      rules: {}
    }
  ]
};
