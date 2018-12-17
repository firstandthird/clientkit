const cleanOutput = require('./clean-output');
const extractCss = require('./extract-css');
const spriteLoader = require('./sprite-loader');
const fixStyleEntries = require('./fix-style-entries');

module.exports = {
  cleanOutput,
  fixStyleEntries,
  extractCss,
  spriteLoader
};
