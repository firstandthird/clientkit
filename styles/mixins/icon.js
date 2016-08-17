'use strict';
const path = require('path');
const pathExists = require('path-exists');
module.exports = function(config) {
  return function(rule, icon, size, fill) {
    const iconpath = path.resolve(__dirname, '../../icons/ionicons/', `${icon}.svg`);

    if (!pathExists.sync(iconpath)) {
      throw new Error(`invalid icon: ${icon}`);
    }
    if (!fill) {
      fill = config.color.icons;
    }

    return {
      background: `svg-load('${iconpath}', fill=${fill});`,
      'background-size': size,
      display: 'inline-block',
      'vertical-align': 'middle',
      height: size,
      width: size
    };
  };
};
