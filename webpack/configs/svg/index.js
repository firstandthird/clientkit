const { spriteLoader, fixStyleEntries, assetsManifest } = require('../../plugins');
const svgLoader = require('./loader');
const entryNormalizer = require('../../entry-normalizer');
const paths = require('../../../paths');
const SVGSpriteTask = require('taskkit-svg-sprite');
const fs = require('fs');

module.exports = config => {
  const entry = entryNormalizer(config.svgsprite.files, paths.tags);
  const dist = config.svgsprite.dist || config.dist;
  const enableHashing = paths.isProduction && !config.hash.disabled;

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
      {
        apply: (compiler) => {
          const files = {};
          let assets = null;

          if (enableHashing) {
            const contents = fs.readFileSync(`${dist}/assets.json`, 'utf8');
            assets = JSON.parse(contents);
          }

          Object.keys(entry).forEach(file => {
            const fileName = `${file}.svg`;

            if (assets !== null) {
              files[assets[fileName]] = entry[file];
            } else {
              files[fileName] = entry[file];
            }
          });

          compiler.hooks.afterEmit.tapAsync('SVGSpriteTask', (c, done) => {
            const task = new SVGSpriteTask('sprite', {
              dist,
              disableSVGO: !config.svgsprite.useSVGO,
              files
            }, {});

            task.execute().then(() => done());
          });
        }
      }
    ]
  };

  if (enableHashing) {
    svgConfig.plugins.push(assetsManifest(config));
  }

  return svgConfig;
};
