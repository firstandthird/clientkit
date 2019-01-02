const path = require('path');

/**
 * Converts as follow:
 *   something.{extension}: './something.{extension}'
 *
 *  to
 *
 *   something: './something.{extension}'
 *
 * @param {?Object} obj
 * @return Object
 */
module.exports = obj => {
  const result = {};

  if (obj) {
    Object.keys(obj).forEach(name => {
      const filePath = obj[name];
      const normalized = path.basename(name, path.extname(name));

      result[normalized] = filePath;
    });
  }

  return result;
};
