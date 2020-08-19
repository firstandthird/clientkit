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
      {
        apply: (compiler) => {
          compiler.hooks.afterEmit.tapAsync('SVGSpriteTask', (c, done) => {
            const hrstart = process.hrtime();
            const outputFiles = [];
            const files = {};
            const hashes = {};

            Object.keys(entry).forEach(file => {
              const fileName = `${file}.svg`;
              files[fileName] = entry[file];
              hashes[fileName] = fileName;

              outputFiles.push(path.resolve(dist, fileName));
            });

            const task = new SVGSpriteTask('sprite', {
              dist,
              disableSVGO: !config.svgsprite.useSVGO,
              files
            }, {});

            task.execute().then(() => {
              // Transform to hash
              if (paths.isProduction && enableHashing) {
                outputFiles.forEach(file => {
                  const content = fs.readFileSync(file, 'utf8');
                  const hash = crypto.createHash('md5').update(content).digest('hex');
                  const fileName = path.basename(file);
                  const newFileName = `${path.basename(file, '.svg')}.${hash}.svg`;
                  const newFilePath = path.resolve(dist, newFileName);
                  console.log('Hashing: %s ➜ %s', fileName, newFileName);
                  fs.renameSync(file, newFilePath);
                  hashes[fileName] = newFileName;
                });
              }

              if (enableHashing) {
                let assets = {};

                if (fs.existsSync(config.hash.mappingFile)) {
                  const contents = fs.readFileSync(config.hash.mappingFile, 'utf8');
                  assets = JSON.parse(contents);
                }

                Object.keys(hashes).forEach(hash => {
                  assets[hash] = hashes[hash];
                });

                fs.writeFileSync(config.hash.mappingFile, JSON.stringify(assets, null, 2));
              }

              const hrend = process.hrtime(hrstart);
              console.info('Execution time: %dms', hrend[1] / 1000000);

              done();
            });
          });
        }
      }
    ]
  };

  return svgConfig;
};
