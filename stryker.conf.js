const strykerBaseConfig = require('./stryker-ci.conf');

/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
module.exports = {
  ...strykerBaseConfig,
  karma: {
    configFile: `karma.conf.js`,
    projectType: 'angular-cli',
    config: {
      browsers: ['ChromeHeadlessCI']
    }
  }
};
