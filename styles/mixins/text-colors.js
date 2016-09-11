'use strict';

module.exports = function (config) {
  return function (mixin) {
    const styles = {};
    const isWhitelisted = color => color.startsWith('text-color-');
    const colors = Object.keys(config.color);
    const getColorObject = color => ({ 'color': config.color[color] });

    colors.forEach(color => {
      if (isWhitelisted(color)) {
        styles[`.text-${color.replace('text-color-', '')}`] = getColorObject(color);
      }
    });

    return styles;
  };
};
