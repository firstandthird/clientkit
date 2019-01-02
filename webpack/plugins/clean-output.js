const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = (paths = []) => new CleanWebpackPlugin(
  [
    ...paths
  ],
  {
    watch: false,
    allowExternal: true
  }
);
