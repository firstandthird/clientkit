const cleanOutput = require('./clean-output');
const extractCss = require('./extract-css');
const spriteLoader = require('./sprite-loader');
const fixStyleEntries = require('./fix-style-entries');
const assetsManifest = require('./assets-manifest');
const lintCss = require('./lint-css');

module.exports = {
  cleanOutput,
  fixStyleEntries,
  extractCss,
  spriteLoader,
  lintCss,
  assetsManifest
};
