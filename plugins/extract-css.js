const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');
const paths = require('../paths');

module.exports = new ExtractCssChunks({
  filename: paths.isProduction ? '[name].[contenthash].css' : '[name].css',
  chunkFilename: '[id]'
});
