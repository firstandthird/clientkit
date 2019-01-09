const eslintRules = require('./eslint-rules');
const jsRules = require('./js-rules');
const paths = require('../../../paths');
const entryNormalizer = require('../../entry-normalizer');
const { assetsManifest } = require('../../plugins');

module.exports = config => {
  const jsConfig = {
    entry: entryNormalizer(config.scripts.files),
    devtool: (paths.isProduction) ? false : 'source-map',
    module: {
      rules: [
        eslintRules(config),
        jsRules(config)
      ]
    },
    output: {
      path: config.scripts.dist || config.dist,
      filename: paths.isProduction ? '[name].[contenthash].js' : '[name].js'
    },
    plugins: [],
    mode: paths.isProduction ? 'production' : 'development'
  };

  if (paths.isProduction) {
    jsConfig.plugins.push(assetsManifest(config));
  }

  return jsConfig;
};
