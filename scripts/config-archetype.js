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
  'README.md',
  'src/index.html',
  'src/app/app-config.constants.ts',
  'src/environments/environment.ts'
].map((rootPath) => getRelativePath('../' + rootPath));

const FILES_TO_AUTODESTROY = ['scripts/config-archetype.js'].map((rootPath) => getRelativePath('../' + rootPath));

const DIRS_TO_AUTODESTROY = ['scripts'].map((rootPath) => getRelativePath('../' + rootPath));

/**
 *
 * @param filepaths
 * @param oldText
 * @param newText
 */
async function replaceFiles(filepaths, oldText, newText) {
  let filesReplaced = [];
  let filesError = [];
  await Promise.all(
    filepaths.map((filepath) =>
      replaceFileContent(filepath, new RegExp(oldText, 'g'), newText)
        .then(() => filesReplaced.push(filepath))
        .catch(() => filesError.push(filepath))
    )
  );
  log(`Replaced "${oldText}" -> "${newText}" in ${filesReplaced.length} files. Errors in ${filesError.length} files.`);
  if (filesError.length > 0) {
    log(`  Errors:\n${filesError.map((f) => '\t> ' + f).join('\n')}`);
  }
}

// TODO: put complexity to 3. 2 better
// eslint-disable-next-line complexity
/**
 *
 * @param {...any} args
 */
async function main(...args) {
  const config = parseArguments(...args);
  const appName = sanitizeAppName(config.appName);
  if (!appName) {
    errorAndClose('Mandatory argument --appName not provided');
  }
  isValidAppName(appName);
  const scope = config.scope;
  const currentAppName = config.reset ? appName : 'yourAppName';
  const newAppName = config.reset ? 'yourAppName' : appName;
  // Replace yourAppName
  log(`Applying configuration:\n\tappName->${appName}\n\tscope->${scope ? scope : 'not provided'}\n`);
  await replaceFiles(YOUR_APP_NAME_FILES, currentAppName, newAppName);
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
  packageContent.name = newPackageName;
  packageContent.version = newVersion;
  await writeAppFile(packagePath, packageContent);
  await setBasehref(appName);
  autoDestroyConfArchetype();
}

const writeAppFile = async (filePath, fileContent) => {
  await writeFile(filePath, JSON.stringify(fileContent, null, 2) + '\n', {
    encoding: 'utf-8'
  });
};

const setBasehref = async (appName) => {
  const angularPath = getRelativePath('../angular.json');
  const angularContent = await getFileJson(angularPath);
  const baseHref = `/${appName}`;
  angularContent.projects[appName].architect.build.options.baseHref = baseHref;
  await writeAppFile(angularPath, angularContent);
};

const getPackageName = (config, scope, appName) => {
  if (config.reset) {
    return '@mercadona/arquetype';
  }
  return scope ? `${scope}/${appName}` : appName;
};

const autoDestroyConfArchetype = () => {
  try {
    FILES_TO_AUTODESTROY.forEach((fileToDelete) => {
      if (fs.existsSync(fileToDelete)) {
        fs.unlinkSync(fileToDelete);
      }
    });
    DIRS_TO_AUTODESTROY.forEach((dirToDelete) => {
      if (fs.existsSync(dirToDelete)) {
        fs.rmdirSync(dirToDelete);
      }
    });
  } catch (error) {
    log(`Error when autodestroy scripts folder and content. Cause: ${error}`);
  }
};

const sanitizeAppName = (appName) => {
  const regex = /-front$/gm;
  return regex.test(appName) ? appName.substr(0, appName.length - 6) : appName;
};

const isValidAppName = (appName) => {
  const regExp = /\s|ñ|(\.){2}/im;
  if (regExp.test(appName)) {
    errorAndClose(`Invalid --appName '${appName}' must not contain spaces, ñ or dots`);
  }
};

if (module === require.main) {
  main(...process.argv.slice(2))
    // eslint-disable-next-line no-console
    .then(() => console.log())
    // eslint-disable-next-line no-console
    .catch((e) => console.error('error', e));
}
