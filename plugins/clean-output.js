const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = config => new CleanWebpackPlugin(
  [
    config.dist
  ],
  {
    watch: false,
    allowExternal: true
  }
);
