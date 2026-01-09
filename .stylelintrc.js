// Stylelint configuration using Mercadona's corporate rules
const stylelintConfig = require('@mercadona/eslint-plugin/src/configs/css-config.js');

// File patterns
const scssPattern = ['**/*.scss'];
const cssPattern = ['**/*.css'];

module.exports = {
  // Extend Mercadona's corporate Stylelint configuration
  ...stylelintConfig,
  overrides: [
    // SCSS files
    {
      files: scssPattern,
      rules: {}
    },
    // CSS files
    {
      files: cssPattern,
      rules: {}
    }
  ]
};
