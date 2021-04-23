const { spriteLoader, fixStyleEntries, assetsManifest } = require('../../plugins');
const svgLoader = require('./loader');
const entryNormalizer = require('../../entry-normalizer');
const paths = require('../../../paths');
const SVGSpriteTask = require('taskkit-svg-sprite');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

module.exports = config => {
  const entry = entryNormalizer(config.svgsprite.files, paths.tags);
  const dist = config.svgsprite.dist || config.dist;
  const enableHashing = !config.hash.disabled;

  const svgConfig = {
    entry,
    module: {
      rules: [
        svgLoader(config)
      ]
    },
    output: {
      path: dist
    },
    plugins: [
      spriteLoader,
      fixStyleEntries,
      // Due to https://github.com/kisenka/svg-sprite-loader/issues/320
      // This should probably just be transformed to a custom webpack plugin, will wait for WP5
    ]
  };

  return svgConfig;
};
