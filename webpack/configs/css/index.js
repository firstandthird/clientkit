const { extractCss, fixStyleEntries, assetsManifest } = require('../../plugins');
const loader = require('./loader');
const paths = require('../../../paths');
const entryNormalizer = require('../../entry-normalizer');

module.exports = config => {
  const cssConfig = {
    entry: entryNormalizer(config.stylesheets.files, config.tags),
    devtool: paths.isProduction ? false : 'source-map',
    resolve: {
      extensions: ['.css', '.scss']
    },
    module: {
      rules: [
        loader(config)
      ]
    },
    output: {
      path: config.stylesheets.dist || config.dist
    },
    plugins: [
      extractCss,
      fixStyleEntries
    ]
  };

  if (paths.isProduction) {
    cssConfig.plugins.push(assetsManifest(config));
  }

  return cssConfig;
};
