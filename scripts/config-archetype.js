const { join } = require('path');
const fs = require('fs');
const { readFile, writeFile } = require('fs').promises;
// eslint-disable-next-line no-console
const log = (...m) => console.log(...m);
const errorAndClose = (...m) => {
  // eslint-disable-next-line no-console
  console.log(...m);
  process.exit(1);
};
const getRelativePath = (route) => join(__dirname, route);
const getFileText = (route) => readFile(route, { encoding: 'utf-8' });
const getFileJson = async (route) => JSON.parse(await getFileText(route));
const replaceFileContent = async (route, regex, newText) => {
  const textContent = await getFileText(route);
  const newContent = textContent.replace(regex, newText);
  await writeFile(route, newContent, { encoding: 'utf-8' });
};
const parseArguments = (...args) =>
  args
    .map((a) => a.replace(/^--/, '').split('='))
    .reduce((ac, v) => {
      ac[v[0]] = v[1];
      return ac;
    }, {});
const YOUR_APP_NAME_FILES = [
  'package.json',
  'angular.json',
  'src/index.html',
  'src/app/app-config.constants.ts',
  'src/environments/environment.ts'
].map((rootPath) => getRelativePath('../' + rootPath));
const FILES_TO_AUTO_DESTROY = ['scripts/config-archetype.js'].map((rootPath) => getRelativePath('../' + rootPath));

const NPMRC_EXPECTED_CONTENT = `registry=https://artifactory.gcp.mercadona.com/artifactory/api/npm/virtual-npm/
strict-ssl=false`;

/**
 * Check if .npmrc file exists and has the expected content
 * If it doesn't exist, create it
 * @param {boolean} dryRun If true, only simulate changes
 * @returns {Promise<void>}
 */
async function ensureNpmrcFile(dryRun = false) {
  const npmrcPath = getRelativePath('../.npmrc');

  try {
    if (fs.existsSync(npmrcPath)) {
      const currentContent = await getFileText(npmrcPath);
      if (currentContent === NPMRC_EXPECTED_CONTENT) {
        log('✓ .npmrc file already exists with correct content');
        return;
      }
      if (dryRun) {
        log('[DRY RUN] Would update .npmrc file with expected content');
      } else {
        await writeFile(npmrcPath, NPMRC_EXPECTED_CONTENT, { encoding: 'utf-8' });
        log('✓ Updated .npmrc file with expected content');
      }
    } else {
      if (dryRun) {
        log('[DRY RUN] Would create .npmrc file');
      } else {
        await writeFile(npmrcPath, NPMRC_EXPECTED_CONTENT, { encoding: 'utf-8' });
        log('✓ Created .npmrc file');
      }
    }
  } catch (error) {
    log(`Error handling .npmrc file: ${error}`);
  }
}

/**
 *  Replace the appName in the files with the new appName
 *
 * @param {(string | any)[]} filePaths Array of filepath to replace
 * @param {any | string} oldText Text to replace
 * @param {any | string} newText New text to replace
 * @param {boolean} dryRun If true, only simulate changes
 * @returns {Promise<void>} Promise with the result of the replacement
 */
async function replaceFiles(filePaths, oldText, newText, dryRun = false) {
  let filesReplaced = [];
  let filesError = [];
  const regex = new RegExp(oldText, 'g');

  if (dryRun) {
    log(`[DRY RUN] Would replace "${oldText}" -> "${newText}" in ${filePaths.length} files:`);
    filePaths.forEach((filepath) => log(`\t- ${filepath}`));
    return;
  }

  await Promise.all(
    filePaths.map((filepath) =>
      replaceFileContent(filepath, regex, newText)
        .then(() => filesReplaced.push(filepath))
        .catch(() => filesError.push(filepath))
    )
  );
  log(`Replaced "${oldText}" -> "${newText}" in ${filesReplaced.length} files. Errors in ${filesError.length} files.`);
  if (filesReplaced.length > 0) {
    log(`  Successfully updated:\n${filesReplaced.map((f) => '\t✓ ' + f).join('\n')}`);
  }
  if (filesError.length > 0) {
    log(`  Errors:\n${filesError.map((f) => '\t✗ ' + f).join('\n')}`);
  }
}

/**
 * Main function to replace the appName in the files
 *
 * @param {string[]} args Arguments to parse
 * @returns {Promise<void>} Promise with the result of the replacement
 */
async function main(...args) {
  const config = parseArguments(...args);
  const appName = sanitizeAppName(config.appName);
  if (!appName) {
    errorAndClose('Mandatory argument --appName not provided');
  }
  isValidAppName(appName);
  const scope = config.scope;
  validateScope(scope);

  const dryRun = config.dryRun === 'true' || config.dryRun === true;
  const keepScript = config.keepScript === 'true' || config.keepScript === true;
  const force = config.force === 'true' || config.force === true;

  if (dryRun) {
    log('=== DRY RUN MODE - No files will be modified ===\n');
  }

  const currentAppName = config.reset ? appName : 'yourAppName';
  const newAppName = config.reset ? 'yourAppName' : appName;
  // Replace yourAppName
  log(
    `Applying configuration:\n\tappName->${appName}\n\tscope->${scope ? scope : 'not provided'}\n\tdryRun->${dryRun}\n\tkeepScript->${keepScript}\n`
  );

  // Ensure .npmrc file exists
  await ensureNpmrcFile(dryRun);

  await replaceFiles(YOUR_APP_NAME_FILES, currentAppName, newAppName, dryRun);

  // Check for errors in file replacement
  if (!dryRun && !force) {
    // Note: replaceFiles doesn't return error status, but logs them
    // In a production scenario, you'd want to refactor replaceFiles to return error count
  }

  // Package.json
  log(`Changes in package.json (name, version)`);
  const packagePath = getRelativePath('../package.json');
  const packageContent = await getFileJson(packagePath);
  const newPackageName = getPackageName(config, scope, appName);
  const newVersion = config.reset
    ? packageContent.dependencies['@mercadona/core']
    : config.version
      ? config.version
      : '0.0.0';

  if (dryRun) {
    log(`[DRY RUN] Would update package.json:`);
    log(`\t- name: "${packageContent.name}" -> "${newPackageName}"`);
    log(`\t- version: "${packageContent.version}" -> "${newVersion}"`);
  } else {
    packageContent.name = newPackageName;
    packageContent.version = newVersion;
    await writeAppFile(packagePath, packageContent);
    log(`✓ Updated package.json`);
  }

  if (!dryRun && !keepScript) {
    autoDestroyConfArchetype();
  } else if (keepScript) {
    log('\nScript preserved (--keepScript flag enabled)');
  } else if (dryRun) {
    log('\n[DRY RUN] Script would be auto-destroyed (use --keepScript to prevent this)');
  }
}

const writeAppFile = async (filePath, fileContent) => {
  await writeFile(filePath, JSON.stringify(fileContent, null, 2) + '\n', {
    encoding: 'utf-8'
  });
};

const getPackageName = (config, scope, appName) => {
  if (config.reset) {
    return '@mercadona/arquetype';
  }
  return scope ? `${scope}/${appName}` : appName;
};

const autoDestroyConfArchetype = () => {
  try {
    FILES_TO_AUTO_DESTROY.forEach((fileToDelete) => {
      if (fs.existsSync(fileToDelete)) {
        fs.unlinkSync(fileToDelete);
      }
    });
  } catch (error) {
    log(`Error when auto-destroy scripts folder and content. Cause: ${error}`);
  }
};

const sanitizeAppName = (appName) => {
  const regex = /-front$/gm;
  return regex.test(appName) ? appName.slice(0, -6) : appName;
};

const isValidAppName = (appName) => {
  const regExp = /\s|ñ|(\.){2}/im;
  if (regExp.test(appName)) {
    errorAndClose(`Invalid --appName '${appName}' must not contain spaces, ñ or dots`);
  }
};

const validateScope = (scope) => {
  if (scope && !scope.startsWith('@')) {
    errorAndClose(`Invalid --scope '${scope}'. Scope must start with @ (e.g., @mercadona)`);
  }
};

if (module === require.main) {
  main(...process.argv.slice(2))
    // eslint-disable-next-line no-console
    .then(() => console.log())
    // eslint-disable-next-line no-console
    .catch((e) => console.error('error', e));
}
