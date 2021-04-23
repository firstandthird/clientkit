const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const fileNameGetter = require('../file-name-getter');

module.exports = (options = {}) => new MiniCssExtractPlugin({
  filename: fileNameGetter(options, '[name].css', '[name].[contenthash].css'),
  chunkFilename: '[id]'
});
