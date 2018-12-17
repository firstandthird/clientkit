const { eslintLoader, jsLoader } = require('../loaders');
const paths = require('../paths');
const entryNormalizer = require('./entry-normalizer');
const { assetsManifest } = require('../plugins');

module.exports = config => {
  const jsConfig = {
    entry: entryNormalizer(config.scripts.files),
    devtool: (paths.isProduction) ? false : 'source-map',
    module: {
      rules: [
        eslintLoader(config),
        jsLoader(config)
      ]
    },
    output: {
      publicPath: config.scripts.assetPath || config.assetPath,
      path: config.scripts.dist || config.dist,
      filename: paths.isProduction ? '[name].[contenthash].js' : '[name].js'
    },
    plugins: []
  };

  if (paths.isProduction) {
    jsConfig.plugins.push(assetsManifest);
  }

  return jsConfig;
};
