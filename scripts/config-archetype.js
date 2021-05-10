const { join } = require('path')
const { readFile, writeFile } = require('fs/promises')

const log = (...m) => console.log(...m);
const errorAndClose = (...m) => {
    console.log(...m);
    process.exit(1);
};

const getRelativePath = route => join(__dirname, route);

const getFileText = route => readFile(route, { encoding: 'utf-8' })
const getFileJson = async (route) => JSON.parse(await getFileText(route))

const replaceFileContent = async (route, regex, newText) => {
    const textContent = await getFileText(route);
    const newContent = textContent.replace(regex, newText);
    await writeFile(route, newContent, { encoding: 'utf-8' });
}

const parseArguments = (...args) => args
    .map(a => a.replace(/^--/,'').split('='))
    .reduce((ac,v) => {ac[v[0]]=v[1]; return ac} ,{});

const YOUR_APP_NAME_FILES = [
        'package.json',
        'angular.json',
        'src/index.html',
        'src/constants/constants.ts',
        'src/environments/environment.ts'
    ].map(rootPath => getRelativePath('../' + rootPath))

async function replaceFiles(filepaths, oldText, newText) {
    let filesReplaced = [];
    let filesError = [];
    await Promise.all(filepaths.map(
        filepath => replaceFileContent(filepath, new RegExp(oldText, 'g'), newText)
            .then(() => filesReplaced.push(filepath))
            .catch(e => filesError.push(filepath))
    ))
    log(`Replaced "${oldText}" -> "${newText}" in ${filesReplaced.length} files. Errors in ${filesError.length} files.`)
    if (filesError.length > 0) {
        log(`  Errors:\n${filesError.map(f => '\t> ' + f).join('\n')}`)
    }
}

async function main(...args) {
    const config = parseArguments(...args);
    const appName = config.appName;
    if (!appName) errorAndClose('Mandatory argument --appName not provided');
    const scope = config.scope;
    const currentAppName = config.reset ? appName : 'yourAppName';
    const newAppName = config.reset ? 'yourAppName': appName;
    // Replace yourAppName
    log(`Applying configuration:\n\tappName->${appName}\n\tscope->${scope ? scope : 'not provided'}\n`)
    await replaceFiles(YOUR_APP_NAME_FILES, currentAppName, newAppName);
    // Package.json    
    log(`Changes in package.json (name, version)`)
    const packagePath = getRelativePath('../package.json');
    const packageContent = await getFileJson(packagePath);
    const newPackageName = config.reset 
        ? '@mercadona-fwk-front/arquetype'
        : scope ? `${scope}/${appName}` : appName;
    const newVersion = config.reset 
        ? packageContent.dependencies['@mercadona-fwk-front/core'] 
        : '0.0.1';
    packageContent.name = newPackageName;
    packageContent.version = newVersion;
    await writeFile(packagePath, JSON.stringify(packageContent, null, 2) + '\n', { encoding: 'utf-8' })
}

if (module === require.main) {
    main(...process.argv.slice(2)).then(() => console.log()).catch(e => console.error('error', e))
}
