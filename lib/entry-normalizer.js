const path = require('path');

/**
 * Converts as follow:
 *   something.{extension}: './something.{extension}'
 *
 *  to
 *
 *   something: './something.{extension}'
 * @param obj
 */
module.exports = obj => {
  const result = {};

  Object.keys(obj).forEach(name => {
    const filePath = obj[name];
    const normalized = path.basename(name, path.extname(name));

    result[normalized] = filePath;
  });

  return result;
};
