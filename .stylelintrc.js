// Stylelint configuration using Mercadona's corporate rules
// Import Mercadona's corporate Stylelint configuration
// Importing directly from node_modules to bypass package exports restriction
import stylelintConfig from './node_modules/@mercadona/eslint-plugin/src/configs/css-config.js';

// File patterns
const scssPattern = ['**/*.scss'];
const cssPattern = ['**/*.css'];

export default {
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
