/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
module.exports = {
  $schema: './node_modules/@stryker-mutator/core/schema/stryker-schema.json',
  _comment:
    "This config was generated using 'stryker init'. Please see the guide for more information: https://stryker-mutator.io/docs/stryker-js/guides/angular",
  mutate: [
    'src/app/**/*.ts',
    '!src/app/**/models/**/*.ts',
    '!src/app/**/mocks/**/*.ts',
    `!src/app/**/swagger/**/*.ts`,
    '!src/app/**/*.spec.ts',
    `!src/app/**/*.dto.ts`,
    '!src/app/**/*.+(enum|enums).ts',
    '!src/app/**/*.+(interface|interfaces).ts',
    '!src/app/**/*.+(mock|mocks).ts',
    '!src/app/**/*.+(model|models).ts',
    '!src/app/**/*.+(type|types).ts',
    '!src/app/**/*.+(contract|contracts).ts',
    '!src/app/**/*.+(constant|constants).ts',
    '!src/app/**/*.module.ts',
    '!src/app/**/*.routes.ts',
    '!src/app/app.config.ts',
    `!src/app/di/**/*.provider.ts`
  ],
  testRunner: 'karma',
  karma: {
    configFile: `karma-ci.conf.js`,
    projectType: 'angular-cli',
    config: {
      browsers: ['GridChrome']
    }
  },
  mutator: {
    excludedMutations: [
      'BlockStatement',
      'MethodExpression',
      'ObjectLiteral',
      'Regex',
      'ArrowFunction',
      'EqualityOperator',
      'OptionalChaining'
    ]
  },
  logLevel: 'info',
  reporters: ['progress', 'clear-text', 'html', 'json'],
  coverageAnalysis: 'perTest',
  ignoreStatic: true,
  incremental: true,
  incrementalFile: `.stryker/stryker-incremental.json`,
  concurrency: 1,
  timeoutMS: 60000,
  checkers: ['typescript'],
  tsconfigFile: `tsconfig.json`,
  typescriptChecker: {
    prioritizePerformanceOverAccuracy: true
  },
  ignorers: ['angular'],
  ignorePatterns: [
    '/coverage',
    '/dist',
    '/.gitlab',
    '/.angular',
    '/.vscode',
    '/.idea',
    '/.husky',
    '/.history',
    '/reports',
    '/scripts',
    '/swagger',
    '/.stryker'
  ],
  dryRunTimeoutMinutes: 15,
  cleanTempDir: 'always'
};
