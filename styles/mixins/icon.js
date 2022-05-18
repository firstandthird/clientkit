// the icon mixin is for creating style definitions for svg icons
// put your icon.svg files in your assetPath/icons folder to make them available
const path = require('path');
const pathExists = require('path-exists');

module.exports = function(config) {
  return function(rule, icon, size, fill) {
    const iconFile = `${icon}.svg`;
    // icons are specified under the /icons path :
    const iconpath = path.resolve(config.assetPath, 'icons', iconFile);
    if (!pathExists.sync(iconpath)) {
      throw new Error(`Unable to locate ${iconFile} in assetPath /icons folder ${iconpath}`);
    }
    if (!fill) {
      fill = config.color.icons;
    } else {
      fill = config.color[fill];
      if (!fill) {
        throw new Error(`${fill} must be a color variable name`);
      }
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
