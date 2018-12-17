const WebpackAssetsManifest = require('webpack-assets-manifest');

module.exports = new WebpackAssetsManifest({
  output: 'assets.json',
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
