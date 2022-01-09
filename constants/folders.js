const path = require('path');

const BASEDIR = process.cwd();
const BUILDPATH = '/build';
const BUILDDIR = path.join(BASEDIR, `${BUILDPATH}`);
const BACKUPPATH = '/backup';
const BACKUPDIR = path.join(BUILDDIR, `${BACKUPPATH}`);
const CONSTANTSPATH = '/constants';
const CONSTANTSDIR = path.join(BASEDIR, `${CONSTANTSPATH}`);
const FAILEDMINTSPATH = '/failedMints';
const FAILEDMINTSDIR = path.join(BUILDDIR, `${FAILEDMINTSPATH}`);
const GENERICJSONPATH = '/genericJSON';
const GENERICJSONDIR = path.join(BUILDDIR, `${GENERICJSONPATH}`);
const GIFSPATH = '/gifs';
const GIFSDIR = path.join(BUILDDIR, `${GIFSPATH}`);
const IMAGESPATH = '/images';
const IMAGESDIR = path.join(BUILDDIR, `${IMAGESPATH}`);
const JSONPATH = '/json';
const JSONDIR = path.join(BUILDDIR, `${JSONPATH}`);
const BACKUPJSONDIR = path.join(BACKUPDIR, `${JSONPATH}`);
const LAYERSPATH = '/layers';
const LAYERSDIR = path.join(BASEDIR, `${LAYERSPATH}`);
const MINTEDPATH = '/minted';
const MINTEDDIR = path.join(BUILDDIR, `${MINTEDPATH}`);
const BACKUPMINTEDDIR = path.join(BACKUPDIR, `${MINTEDPATH}`);
const MODULESPATH = '/modules';
const MODULESDIR = path.join(BASEDIR, `${MODULESPATH}`);
const NODEMODULESPATH = '/node_modules';
const NODEMODULESDIR = path.join(BASEDIR, `${NODEMODULESPATH}`);
const PIXELIMAGESPATH = '/pixel_images';
const PIXELIMAGESDIR = path.join(BUILDDIR, `${PIXELIMAGESPATH}`);
const REMINTEDPATH = '/reMinted';
const REMINTEDDIR = path.join(BUILDDIR, `${REMINTEDPATH}`);
const REVEALEDPATH = '/revealed';
const REVEALEDDIR = path.join(BUILDDIR, `${REVEALEDPATH}`);
const SOURCEPATH = '/src';
const SOURCEDIR = path.join(BASEDIR, `${SOURCEPATH}`);

const FOLDERS = {
  baseDir: `${BASEDIR}`,
  buildPath: `${BUILDPATH}`,
  buildDir: `${BUILDDIR}`,
  backupPath: `${BACKUPPATH}`,
  backupDir: `${BACKUPDIR}`,
  constantsPath: `${CONSTANTSPATH}`,
  constantsDir: `${CONSTANTSDIR}`,
  failedMintsPath: `${FAILEDMINTSPATH}`,
  failedMintsDir: `${FAILEDMINTSDIR}`,
  genericJSONPath: `${GENERICJSONPATH}`,
  genericJSONDir: `${GENERICJSONDIR}`,
  gifsPath: `${GIFSPATH}`,
  gifsDir: `${GIFSDIR}`,
  imagesPath: `${IMAGESPATH}`,
  imagesDir: `${IMAGESDIR}`,
  jsonPath: `${JSONPATH}`,
  jsonDir: `${JSONDIR}`,
  backupJSONDir: `${BACKUPJSONDIR}`,
  layersPath: `${LAYERSPATH}`,
  layersDir: `${LAYERSDIR}`,
  mintedPath: `${MINTEDPATH}`,
  mintedDir: `${MINTEDDIR}`,
  backupMintedDir: `${BACKUPMINTEDDIR}`,
  modulesPath: `${MODULESPATH}`,
  modulesDir: `${MODULESDIR}`,
  nodeModulesPath: `${NODEMODULESPATH}`,
  nodeModulesDir: `${NODEMODULESDIR}`,
  pixelImagesPath: `${PIXELIMAGESPATH}`,
  pixelImagesDir: `${PIXELIMAGESDIR}`,
  remintedPath: `${REMINTEDPATH}`,
  remintedDir: `${REMINTEDDIR}`,
  revealedPath: `${REVEALEDPATH}`,
  revealedDir: `${REVEALEDDIR}`,
  sourcePath: `${SOURCEPATH}`,
  sourceDir: `${SOURCEDIR}`
};

module.exports = {
  FOLDERS
};
