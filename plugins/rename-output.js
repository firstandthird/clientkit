const RenameWebpackPlugin = require('rename-webpack-plugin');

module.exports = new RenameWebpackPlugin({
  originNameReg: /.js.js/,
  targetName: '.js'
});
