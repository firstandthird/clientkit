const path = require('path');
const pathExists = require('path-exists');

module.exports = config => {
  let mixins = {};

  if (config.globalMixins) {
    try {
      mixins = require('require-all')({
        dirname: path.join(config.globalMixins),
        resolve: m => m(config)
      });
    } catch (e) {
      this.log(e);
    }
  }

  if (config.assetPath && pathExists.sync(path.join(config.assetPath, 'mixins'))) {
    const localMixins = require('require-all')({
      dirname: path.join(config.assetPath, 'mixins'),
      resolve: m => m(config)
    });

    Object.assign(mixins, localMixins);
  }

  return mixins;
};
