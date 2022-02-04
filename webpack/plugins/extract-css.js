const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');
const fileNameGetter = require('../file-name-getter');

module.exports = (options = {}) => new ExtractCssChunks({
  filename: fileNameGetter(options, '[name].css', '[name].[contenthash].css'),
  chunkFilename: '[id]',
});
