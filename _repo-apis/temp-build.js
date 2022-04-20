// temp-build.js

const FS = require('fs-extra');
const EXCLUDE = ['_repo-apis', '.vscode', '.gitignore', 'README.md', 'temp.js'];

/**
 * Finds and returns the absolute path to the examples directory, should be one
 * level above where this script is executed
 * @returns {string} The absolute path to the examples directory
 */
function getExamplesDirectory() {
  let currDir = __dirname.split('/');
  currDir.pop();
  return currDir.join('/');
}

/**
 *
 * @param {string} dir the directory with which to search for files
 * @param {array<string>} exclude A list of files / directories to exclude in
 *                                file search
 * @returns {array<string>} an array of all of the paths of the found files
 */
function recursiveFileSearch(dir, exclude) {
  let entitiesInDir, dirsInDir, filesInDir;
  // Get everything in the directory first
  entitiesInDir = FS.readdirSync(dir);
  // Filter out everything that's not allowed
  entitiesInDir = entitiesInDir.filter((entity) => {
    if (exclude.includes(entity)) return false;
    if (entity.charAt(0) == '.' || entity.charAt(0) == '_') return false;
    return true;
  });
  // Separate the directories and files
  filesInDir = [];
  dirsInDir = entitiesInDir.filter((entity) => {
    // if it's a directory keep it so it can be stored in dirsInDir
    if (FS.lstatSync(`${dir}/${entity}`).isDirectory()) return true;
    // otherwise add it to our list of files
    filesInDir.push(`${dir}/${entity}`);
    // and filter it out by returning false
    return false;
  });
  // Add all of the files in the directories we found in our main files array
  dirsInDir.forEach((subDir) => {
    filesInDir = filesInDir.concat(recursiveFileSearch(`${dir}/${subDir}`, []));
  });
  // Return our main files array
  return filesInDir;
}

function init() {
  // Grab the absolute path to the examples dir
  let examplesDir = getExamplesDirectory();
  // Search for every file, excluding these directories
  let allFiles = recursiveFileSearch(examplesDir, EXCLUDE);
  let indexFiles = allFiles.filter((file) => file.endsWith('/index.html'));
  indexFiles.forEach((file) => {
    file = file.replace('/index.html', '/dir-config.json');
    if (FS.existsSync(file)) {
      FS.rmSync(file);
    }
  });
}

// console.log(__dirname.replace('/examples/_repo-apis', ''));
init();
