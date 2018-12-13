const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');

module.exports = new ExtractCssChunks({
  filename: '[name].css',
  chunkFilename: '[name].css'
});
