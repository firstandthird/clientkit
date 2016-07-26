'use strict';

module.exports = function (config) {
  return function (mixin) {
    const styles = {};
    const blacklist = ['input', 'background', 'link', 'button', 'border'];
    const isBlacklisted = arr => blacklist.some(v => (arr.indexOf(v) >= 0));
    const colors = Object.keys(config.color);
    const getColorObject = color => ({ 'background-color': config.color[color] });

    colors.forEach(color => {
      if (!isBlacklisted(color.split('-'))) {
        styles[`.bg-${color}`] = getColorObject(color);
      }
    });

    return styles;
  };
};
