const { extractCss, fixStyleEntries, assetsManifest } = require('../../plugins');
const loader = require('./loader');
const paths = require('../../../paths');
const entryNormalizer = require('../../entry-normalizer');
const StylelintPlugin = require('stylelint-webpack-plugin');

module.exports = config => {
  console.log(config.stylesheets);

  const cssConfig = {
    entry: entryNormalizer(config.stylesheets.files, paths.tags),
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
      new StylelintPlugin({
        files: '**/*.css'
      }),
      extractCss(config),
      fixStyleEntries
    ]
  };

  if (!config.hash.disabled) {
    cssConfig.plugins.push(assetsManifest(config));
  }

  return cssConfig;
};
