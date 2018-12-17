const { eslintLoader, jsLoader } = require('../loaders');
const paths = require('../paths');

module.exports = config => ({
  entry: config.scripts.files,
  devtool: (paths.isProduction) ? false : 'source-map',
  module: {
    rules: [
      eslintLoader(config),
      jsLoader
    ]
  },
  output: {
    publicPath: config.scripts.assetPath || config.assetPath,
    path: config.scripts.dist || config.dist,
    filename: '[name]'
  }
});
