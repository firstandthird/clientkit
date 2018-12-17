const { extractCss, fixStyleEntries } = require('../plugins');
const { cssLoader } = require('../loaders');
const paths = require('../paths');

module.exports = config => ({
  entry: config.stylesheets.files,
  devtool: (paths.isProduction) ? false : 'source-map',
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
});
