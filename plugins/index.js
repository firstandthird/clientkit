const cleanOutput = require('./clean-output');
const extractCss = require('./extract-css');
const spriteLoader = require('./sprite-loader');
const fixStyleEntries = require('./fix-style-entries');
const renameOutput = require('./rename-output');

module.exports = config => [
  cleanOutput(config),
  fixStyleEntries,
  extractCss,
  spriteLoader,
  renameOutput
];
