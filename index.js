const BASEDIR = process.cwd();
const { FOLDERS } = require(`${BASEDIR}/constants/folders.js`);
const { startCreating, buildSetup } = require(`${FOLDERS.sourceDir}/main.js`);

(() => {
  buildSetup();
  startCreating();
})();
