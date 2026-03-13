import strykerBaseConfig from './stryker-ci.conf.js';

/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
export default {
  ...strykerBaseConfig,
  karma: {
    configFile: 'karma.conf.js',
    projectType: 'angular-cli',
    config: {
      browsers: ['ChromeHeadlessCI']
    }
  }
};
