const { spriteLoader, fixStyleEntries } = require('../plugins');
const { svgLoader } = require('../loaders');

module.exports = config => ({
  entry: config.svgsprite.files,
  module: {
    rules: [
      svgLoader(config)
    ]
  },
  output: {
    publicPath: config.svgsprite.assetPath || config.assetPath,
    path: config.svgsprite.dist || config.dist
  },
  plugins: [
    spriteLoader,
    fixStyleEntries
  ]
});
