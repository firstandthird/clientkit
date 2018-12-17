const { extractCss, fixStyleEntries, assetsManifest } = require('../plugins');
const { cssLoader } = require('../loaders');
const paths = require('../paths');
const entryNormalizer = require('./entry-normalizer');

module.exports = config => {
  const cssConfig = {
    entry: entryNormalizer(config.stylesheets.files),
    devtool: paths.isProduction ? false : 'source-map',
    module: {
      rules: [
        cssLoader(config)
      ]
    },
    output: {
      publicPath: config.stylesheets.assetPath,
      path: config.stylesheets.dist || config.dist
    },
    plugins: [
      extractCss,
      fixStyleEntries
    ]
  };

  if (paths.isProduction) {
    cssConfig.plugins.push(assetsManifest);
  }

  return cssConfig;
};
