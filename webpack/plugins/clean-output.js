const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = () => new CleanWebpackPlugin({
  verbose: false,
  cleanOnceBeforeBuildPatterns: [] // Prevents files from being removed that shouldnt
});
