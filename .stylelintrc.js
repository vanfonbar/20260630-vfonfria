const stylelintConfig = require('@mercadona/eslint-plugin/src/configs/css-config.js');
const scssPattern = ['**/*.scss'];
const cssPattern = ['**/*.css'];

module.exports = {
  ...stylelintConfig,
  overrides: [
    {
      files: scssPattern,
      rules: {}
    },
    {
      files: cssPattern,
      rules: {}
    }
  ]
};
