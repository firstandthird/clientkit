const path = require('path');
const WebpackAssetsManifest = require('webpack-assets-manifest');

const data = Object.create(null);

module.exports = (options = {}) => {
  const distFolder = options.dist || options.hash.dist;
  const defaultMappingFile = (options.hash && options.hash.mappingFile) ? options.hash.mappingFile : 'assets.json';
  const output = path.resolve(distFolder, defaultMappingFile);

  return new WebpackAssetsManifest({
    output,
    assets: data,
    merge: 'customize',
    customize(entry) {
      if (entry.key.includes('.svg')) {
        entry.key = entry.key.replace(/.[a-f0-9]{32}./gi, '.');
      }
    }
  });
};
