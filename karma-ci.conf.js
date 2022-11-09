// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  const webdriverConfig = {
    hostname: 'selenium-hub.cloudbees-agents.svc.cluster.local',
    port: 4444
  };

  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-webdriver-launcher'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-spec-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma'),
      require('karma-sonarqube-unit-reporter')
    ],
    client: {
      jasmine: {
        // you can add configuration options for Jasmine here
        // the possible options are listed at https://jasmine.github.io/api/edge/Configuration.html
        // for example, you can disable the random execution with `random: false`
        // or set a specific seed with `seed: 4321`
      },
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    jasmineHtmlReporter: {
      suppressAll: true // removes the duplicated traces
    },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage'),
      subdir: '.',
      reporters: [
        { type: 'html', subdir: 'report-html' },
        { type: 'text', subdir: '.', file: 'text.txt' },
        { type: 'text-summary' },
        { type: 'text-summary', subdir: '.', file: 'text-summary.txt' },
        { type: 'cobertura', subdir: 'report-xml' },
        { type: 'lcov', file: 'lcov.info' }
      ],
      watermarks: {
        statements: [70, 80],
        functions: [70, 80],
        branches: [70, 80],
        lines: [70, 80]
      }
    },
    specReporter: {
      maxLogLines: 50, // limit number of lines logged per test
      suppressErrorSummary: false, // do not print error summary
      suppressFailed: false, // do not print information about failed tests
      suppressPassed: false, // do not print information about passed tests
      suppressSkipped: false, // do not print information about skipped tests
      showSpecTiming: false, // print the time elapsed for each spec
      failFast: false, // test would finish with error when a first fail occurs
      prefixes: {
        success: '     OK: ', // override prefix for passed tests, default is '✓ '
        failure: ' FAILED: ', // override prefix for failed tests, default is '✗ '
        skipped: 'SKIPPED: ' // override prefix for skipped tests, default is '- '
      }
    },
    sonarQubeUnitReporter: {
      sonarQubeVersion: 'LATEST',
      outputDir: 'coverage',
      outputFile: 'reports/ut_report.xml',
      useBrowserName: false,
      overrideTestDescription: true,
      testPath: './src',
      testPaths: ['./src'],
      testFilePattern: '.spec.ts'
    },
    reporters: ['kjhtml', 'spec', 'coverage', 'sonarqubeUnit'],
    hostname: process.env.MY_POD_IP,
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['ChromeHeadlessCI', 'GridChrome'],
    singleRun: true,
    browserNoActivityTimeout: 40000,
    restartOnFileChange: false,
    customLaunchers: {
      ChromeHeadlessCI: {
        base: 'ChromeHeadless',
        flags: [
          '--no-sandbox' // required to run without privileges in docker
          // '--disable-web-security', // remove comment if we have CORS problems with local files (karma reports)
        ]
      },
      GridChrome: {
        base: 'WebDriver',
        config: webdriverConfig,
        browserName: 'chrome',
        pseudoActivityInterval: 30000
      }
    }
  });
};
