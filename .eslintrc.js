const tsPattern = '*.ts';
const specPattern = '*.spec.ts';
const e2ePattern = '*.e2e-spec.ts';
const htmlPattern = '*.html';
const inlineHtmlPattern = '*inline-template-*.component.html';
const jsPattern = '*.js';

module.exports = {
  root: true,
  plugins: ['@mercadona/eslint-plugin'],
  overrides: [
    {
      files: [tsPattern],
      excludedFiles: [specPattern, e2ePattern],
      extends: ['plugin:@mercadona/eslint-plugin/ts', 'plugin:@mercadona/eslint-plugin/jsdoc'],
      parserOptions: {
        ecmaVersion: 2020,
        project: ['tsconfig.app.json']
      },
      rules: {}
    },
    {
      files: [specPattern],
      extends: ['plugin:@mercadona/eslint-plugin/ts', 'plugin:@mercadona/eslint-plugin/spec'],
      parserOptions: {
        ecmaVersion: 2020,
        project: ['tsconfig.spec.json']
      },
      rules: {}
    },
    {
      files: [e2ePattern],
      extends: ['plugin:@mercadona/eslint-plugin/ts', 'plugin:@mercadona/eslint-plugin/e2e'],
      parserOptions: {
        ecmaVersion: 2018,
        project: ['e2e/tsconfig.json']
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
    }
  ]
};
