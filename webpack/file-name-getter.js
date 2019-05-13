const paths = require('../paths');

module.exports = (config, normal, hashed) => {
  let fileName = normal;

  if (paths.isProduction) {
    if (config && config.hash && !config.hash.disabled) {
      fileName = hashed;
    }
  }

  return fileName;
};
