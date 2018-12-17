const { spriteLoader, fixStyleEntries, assetsManifest } = require('../plugins');
const { svgLoader } = require('../loaders');
const entryNormalizer = require('./entry-normalizer');
const paths = require('../paths');

module.exports = config => {
  const svgConfig = {
    entry: entryNormalizer(config.svgsprite.files),
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
  };

  if (paths.isProduction) {
    svgConfig.plugins.push(assetsManifest);
  }

  return svgConfig;
};
