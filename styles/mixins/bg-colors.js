'use strict';

module.exports = function (config) {
  return function (mixin) {
    const styles = {};
    const isBgColor = color => color.startsWith('background-');
    const isBgTextColor = color => color.startsWith('background-text-');
    const colors = Object.keys(config.color);

    colors.forEach(color => {
      if (isBgColor(color)) {
        let selector = '';
        let value = '';

        if (isBgTextColor(color)) {
          const bg = `.bg-${color.replace('background-text-', '')}`;
          selector = `${bg},\n${bg} [class*='heading-']:not([class*='color-']),\n${bg} label:not([class*='color-'])`;
          value = { color: config.color[color] };
        } else {
          selector = `.bg-${color.replace('background-', '')}`;
          value = { 'background-color': config.color[color] };
        }

        styles[selector] = value;
      }
    });

    return styles;
  };
};
