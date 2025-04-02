const acorn = require('acorn-loose');
const walk = require('acorn-walk');

const { createHash } = require('crypto');
const { readFileSync, writeFileSync, existsSync, statSync, readdirSync, mkdirSync } = require('fs');
const path = require('path');

const rootPath = path.join(__dirname, '../');

const args = process.argv.slice(2);
const param = args[0];

const isExecForCI = param === 'ci';
const strykerConfPath = path.join(rootPath, isExecForCI ? 'stryker-ci.conf.js' : 'stryker.conf.js');

const testDirPath = path.join(rootPath, `src/app`);
const excludeDir = [];

const strykerConf = require(strykerConfPath);
const incrementalFilePath = path.join(rootPath, strykerConf.incrementalFile);
const hashFilePath = path.join(rootPath, `${strykerConf.incrementalFile.split('/')[0]}/mercadona-incremental.json`);

const updateMark = '// This file was updated by Mercadona';
const mutantTestPlannerFilePath = path.join(
  rootPath,
  'node_modules/@stryker-mutator/core/dist/src/mutants/mutant-test-planner.js'
);
const testHooksMiddlewareFilePath = path.join(
  rootPath,
  'node_modules/@stryker-mutator/karma-runner/dist/src/karma-plugins/test-hooks-middleware.js'
);
const strykerKarmaConfigPath = path.join(
  rootPath,
  'node_modules/@stryker-mutator/karma-runner/dist/src/karma-plugins/stryker-karma.conf.js'
);

const strykerFilesToUpdate = [
  {
    path: mutantTestPlannerFilePath,
    update: updateTestPlannerContent
  },
  {
    path: testHooksMiddlewareFilePath,
    update: updateTestHooksMiddlewareContent
  },
  {
    path: strykerKarmaConfigPath,
    update: overrideStrykerKarmaConfig
  }
];

/**
 * Check for changes in test code and update the incremental file to get Stryker ready to run
 */
function checkChangesOnTests() {
  const testFiles = getTestFiles(testDirPath);
  const currentTestHashes = testFiles.reduce(
    (hashes, filePath) => ({
      ...hashes,
      ...getCurrentTestHashes(filePath)
    }),
    {}
  );

  if (existsSync(hashFilePath) && existsSync(incrementalFilePath)) {
    console.log('Checking changes on tests code...');
    compareTestHashes(currentTestHashes);
  }

  const hashFileDir = path.dirname(hashFilePath);
  if (!existsSync(hashFileDir)) {
    mkdirSync(hashFileDir);
  }

  console.log('Generating mercadona incremental file in:', hashFilePath);
  writeFileSync(hashFilePath, JSON.stringify(currentTestHashes, null, 2), 'utf8');
}

/**
 * Update the Stryker library so that it works correctly, identifying the tests by the full path name
 * and not by the identifier, since this is different in each execution and causes problems.
 */
function updateStrykerLibrary() {
  updateFiles(...strykerFilesToUpdate);
}

/**
 * Update the files with the new content
 *
 * @param { typeof strykerFilesToUpdate } filesToUpdate The files to update
 */
function updateFiles(...filesToUpdate) {
  filesToUpdate.forEach((file) => {
    const fileContent = readFileSync(file.path, 'utf8');
    const isUpdated = fileContent.includes(updateMark);
    if (!isUpdated) {
      console.log(`Updating file: ${file.path}`);
      file.update(fileContent);
    }
  });
}

/**
 * Get all test files in a directory
 *
 * @param { string } dir The directory to search for test files
 *
 * @returns { string[] } The list of test files
 */
function getTestFiles(dir) {
  const files = [];

  readdirSync(dir).forEach((file) => {
    const filePath = path.join(dir, file);
    if (statSync(filePath).isDirectory()) {
      if (!excludeDir.includes(file)) {
        files.push(...getTestFiles(filePath));
      }
    } else if (file.endsWith('.spec.ts')) {
      files.push(filePath);
    }
  });

  return files;
}

/**
 * Build hash from content
 *
 * @param { string } content The content to hash
 *
 * @returns { string } The hash
 */
function buildHash(content) {
  return createHash('md5').update(content).digest('hex');
}

/**
 * Get the content of the current tests and build their hashes
 *
 * @param { string } filePath The path to the test file
 *
 * @returns { { [key: string]: string } } The hashes of the tests
 */
function getCurrentTestHashes(filePath) {
  const fileContent = readFileSync(filePath, 'utf8');
  const testHashes = {};

  const ast = acorn.parse(fileContent, { ecmaVersion: 2022, sourceType: 'module' });

  const describeStack = [];

  walk.simple(ast, {
    CallExpression(node) {
      if (node.callee.name === 'describe' && node.arguments.length === 2) {
        processDescribe(node, describeStack, fileContent, testHashes);
      }
    }
  });

  return testHashes;
}

/**
 * Process a describe block
 *
 * @param { any } node The AST node
 * @param { string[] } state The current describe stack
 * @param { string } fileContent The content of the test file
 * @param { { [key: string]: string } } testHashes The hashes of the tests
 */
function processDescribe(node, state, fileContent, testHashes) {
  const describeName = node.arguments[0].value;
  state.push(describeName);
  walk.recursive(node.arguments[1], state, {
    CallExpression: (innerNode, innerState) => buildPathToTest(innerNode, innerState, fileContent, testHashes)
  });
  state.pop();
}

/**
 * Build the path to the test and generate the hash from the test content
 *
 * @param { any } node The AST node
 * @param { string[] } state The current describe stack
 * @param { string } fileContent The content of the test file
 * @param { { [key: string]: string } } testHashes The hashes of the tests
 */
function buildPathToTest(node, state, fileContent, testHashes) {
  if (node.callee.name === 'describe' && node.arguments.length === 2) {
    processDescribe(node, state, fileContent, testHashes);
  } else if (node.callee.name === 'it' && node.arguments.length === 2) {
    const testName = node.arguments[0].value;
    const fullTestName = `${state.join(' ')} ${testName}`;
    const testContent = fileContent.slice(node.start, node.end);
    testHashes[fullTestName] = buildHash(testContent);
  }
}

/**
 * Compare the current test hashes with the previous ones and remove the tests that have changed
 *
 * @param { { [key: string]: string } } currentHashes The current test hashes
 */
function compareTestHashes(currentHashes) {
  const previousHashes = JSON.parse(readFileSync(hashFilePath, 'utf8'));
  const incrementalData = JSON.parse(readFileSync(incrementalFilePath, 'utf8'));
  let hasChanges = false;

  Object.entries(currentHashes).forEach(([testName, currentHash]) => {
    const previousHash = previousHashes[testName];

    if (previousHash && previousHash !== currentHash) {
      deleteTestOfIncrementalFile(testName, incrementalData.testFiles[''].tests);
      hasChanges = true;
    }
  });

  if (hasChanges) {
    writeFileSync(incrementalFilePath, JSON.stringify(incrementalData, null, 2), 'utf8');
  }
}

/**
 * Delete the test from the incremental file
 *
 * @param  { string } testName The name of the test to delete
 * @param { { id: string; name: string }[] } tests The tests to delete the test from
 */
function deleteTestOfIncrementalFile(testName, tests) {
  const foundTestIndex = tests.findIndex((test) => test.name === testName);

  if (foundTestIndex !== -1) {
    tests.splice(foundTestIndex, 1);
  }
}

/**
 * Update the test planner content file of Stryker to include the test names filter property
 *
 * @param { string } mutantTestPlannerContent The content of the mutant test planner file
 */
function updateTestPlannerContent(mutantTestPlannerContent) {
  const toTestNameFunction = `
  function toTestName(testResults) {
  const result = [];
  for (const test of testResults) {
      result.push(test.name);
  }
  return result;
}
  `;

  const replacesContent = [
    {
      original: 'return this.createMutantRunPlan(mutant, { netTime, coveredBy, isStatic, testFilter: coveredBy });',
      replacement:
        'return this.createMutantRunPlan(mutant, { netTime, coveredBy, isStatic, testFilter: coveredBy, testNamesFilter: toTestName(tests) });'
    },
    {
      original: 'createMutantRunPlan(mutant, { netTime, testFilter, isStatic, coveredBy, })',
      replacement: 'createMutantRunPlan(mutant, { netTime, testFilter, testNamesFilter, isStatic, coveredBy, })'
    },
    {
      original: 'sandboxFileName: this.sandbox.sandboxFileFor(mutant.fileName),',
      replacement: 'testNamesFilter,\n\t\t\t\t\t\t\t\tsandboxFileName: this.sandbox.sandboxFileFor(mutant.fileName),'
    }
  ];

  replacesContent.forEach((replace) => {
    mutantTestPlannerContent = mutantTestPlannerContent.replace(replace.original, replace.replacement);
  });

  const newMutantTestPlannerContent = `
${updateMark}\n
${mutantTestPlannerContent}\n
${toTestNameFunction}
  `;

  writeFileSync(mutantTestPlannerFilePath, newMutantTestPlannerContent, 'utf8');
}

/**
 * Update the test hooks middleware content file of Stryker to include the test names filter property
 *
 * @param { string } testHooksMiddlewareContent The content of the test hooks middleware file
 */
function updateTestHooksMiddlewareContent(testHooksMiddlewareContent) {
  const replacesContent = [
    {
      original: 'configureMutantRun({ activeMutant, testFilter, hitLimit })',
      replacement: 'configureMutantRun({ activeMutant, testFilter, testNamesFilter, hitLimit })'
    },
    {
      original: 'return ${JSON.stringify(testFilter)}.indexOf(spec.id) !== -1;',
      replacement:
        "return ${JSON.stringify(testNamesFilter ?? testFilter)}.indexOf(spec.${ testNamesFilter ? 'getFullName()' : 'id' }) !== -1;"
    }
  ];

  replacesContent.forEach((replace) => {
    testHooksMiddlewareContent = testHooksMiddlewareContent.replace(replace.original, replace.replacement);
  });

  const newTestHooksMiddlewareContent = `
${updateMark}\n
${testHooksMiddlewareContent}
  `;

  writeFileSync(testHooksMiddlewareFilePath, newTestHooksMiddlewareContent, 'utf8');
}

/**
 * Override the Stryker Karma config to include the properties needed to avoid timeouts
 *
 * @param { string } strykerKarmaConfigContent The content of the Stryker Karma config file
 */
function overrideStrykerKarmaConfig(strykerKarmaConfigContent) {
  const propertiesToAdd = `
    captureTimeout: 60000,
    browserDisconnectTolerance: 2,
    browserDisconnectTimeout: 60000,
    pingTimeout: 60000,
    browserSocketTimeout: 30000,
    processKillTimeout: 30000,
  `;

  const modifiedContent = strykerKarmaConfigContent.replace(
    /function setLifeCycleOptions\(config\) \{\s*config\.set\(\{([\s\S]*?)\}\);/,
    `function setLifeCycleOptions(config) {\n  config.set({$1${propertiesToAdd}});`
  );

  const newStrykerKarmaConfigContent = `
${updateMark}\n
${modifiedContent}
  `;

  writeFileSync(strykerKarmaConfigPath, newStrykerKarmaConfigContent, 'utf8');
}

checkChangesOnTests();
updateStrykerLibrary();
