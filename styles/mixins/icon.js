'use strict';
const path = require('path');
const pathExists = require('path-exists');
module.exports = function(config) {
  return function(rule, icon, size, fill) {
    const cssfile = rule && rule.source.input && rule.source.input.file;
    let iconpath = path.resolve(cssfile, icon);

    //check to see if icon is a path that exists
    if (!pathExists.sync(iconpath)) {
      iconpath = path.resolve(__dirname, '../../icons/ionicons/', `${icon}.svg`);
      if (!pathExists.sync(iconpath)) {
        throw new Error(`invalid icon: ${icon}`);
      }
    }

    if (!fill) {
      fill = config.color.icons;
    }

    const styles = {
      'background-image': `svg-load('${iconpath}', fill=${fill});`,
      'background-repeat': 'no-repeat',
      'background-position': 'center',
      display: 'inline-block',
      'vertical-align': 'middle',
    };
    if (size) {
      styles['background-size'] = size;
      styles.height = size;
      styles.width = size;
    }
    return styles;
  };
};
