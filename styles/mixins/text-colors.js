'use strict';

module.exports = function (config) {
  return function (mixin) {
    const styles = {};
    const isWhitelisted = color => color.startsWith('text-color-');
    const colors = Object.keys(config.color);
    const getColorObject = color => ({ color: config.color[color] });
    const root = {};

    root['/* postcss-custom-properties: off '] = ' */';

    colors.forEach(color => {
      if (isWhitelisted(color)) {
        const colorName = color.replace('text-', '');
        const colorValue = getColorObject(color);
        styles[`.${colorName}`] = colorValue;
        root[`--${colorName}`] = colorValue.color;
      }
    });

    styles[':root'] = root;

    return styles;
  };
};
