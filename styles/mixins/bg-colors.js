'use strict';

module.exports = function (config) {
  return function (mixin) {
    const styles = {};
    const isWhitelisted = color => color.startsWith('background-');
    const colors = Object.keys(config.color);
    const getColorObject = color => ({ 'background-color': config.color[color] });

    colors.forEach(color => {
      if (isWhitelisted(color)) {
        styles[`.bg-${color.replace('background-', '')}`] = getColorObject(color);
      }
    });

    return styles;
  };
};
