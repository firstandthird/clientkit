const { extractCss, fixStyleEntries, assetsManifest, lintCss } = require('../../plugins');
const loader = require('./loader');
const paths = require('../../../paths');
const entryNormalizer = require('../../entry-normalizer');

module.exports = config => {
  const entryFiles = entryNormalizer(config.stylesheets.files, paths.tags);

  const cssConfig = {
    entry: entryFiles,
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
      extractCss(config),
      fixStyleEntries,
      lintCss(Object.values(entryFiles), config)
    ]
  };

  if (!config.hash.disabled) {
    cssConfig.plugins.push(assetsManifest(config));
  }

  return cssConfig;
};
