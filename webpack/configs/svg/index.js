const { spriteLoader, fixStyleEntries, assetsManifest } = require('../../plugins');
const svgLoader = require('./loader');
const entryNormalizer = require('../../entry-normalizer');
const paths = require('../../../paths');

module.exports = config => {
  const svgConfig = {
    entry: entryNormalizer(config.svgsprite.files, paths.tags),
    module: {
      rules: [
        svgLoader(config)
      ]
    },
    output: {
      path: config.svgsprite.dist || config.dist
    },
    plugins: [
      spriteLoader,
      fixStyleEntries
    ]
  };

  if (paths.isProduction && !config.hash.disabled) {
    svgConfig.plugins.push(assetsManifest(config));
  }

  return svgConfig;
};
