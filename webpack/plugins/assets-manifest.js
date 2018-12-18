const path = require('path');
const WebpackAssetsManifest = require('webpack-assets-manifest');

module.exports = (options = {}) => {
  const distFolder = options.dist || options.hash.dist;
  const defaultMappingFile = (options.hash && options.hash.mappingFile) ? options.hash.mappingFile : 'assets.json';

  return new WebpackAssetsManifest({
    output: path.resolve(distFolder, defaultMappingFile),
    merge: true,
    // Since the SVG is virtual, it is not based on any entry, hence the hash is
    // present in both ends
    transform(manifest) {
      const transformed = {};

      Object.keys(manifest).forEach(key => {
        const newKey = key.replace(/.[a-f0-9]{32}./gi, '.');
        transformed[newKey] = manifest[key];
      });

      return transformed;
    }
  });
};
