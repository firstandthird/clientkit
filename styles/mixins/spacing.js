'use strict';

module.exports = function (config) {
  const spacingMixin = function(prop, position, size) {
    const styles = {};
    const spacingBreakpoints = Object.keys(config.spacing);

    for (const breakpoint of spacingBreakpoints) {
      let block = styles;
      if (breakpoint !== 'default') {
        const mediaquery = `@media (min-width: ${config.breakpoints[breakpoint]['min-width']})`;
        styles[mediaquery] = {};
        block = styles[mediaquery];
      }

      const spacings = config.spacing[breakpoint] || config.spacing.default;

      block[`${prop}-${position}`] = spacings[size];
    }

    return styles;
  };

  return function (mixin, prop, position, size) {
    if (prop && position && size) {
      return spacingMixin(prop, position, size);
    }
    const styles = {};
    const properties = ['padding', 'margin'];
    const positions = ['top', 'left', 'right', 'bottom'];
    const sizes = Object.keys(config.spacing.default);
    properties.forEach((property) => {
      positions.forEach((position) => {
        sizes.forEach((size) => {
          styles[`${property[0]}-${position[0]}-${size}`] = spacingMixin(property, position, size);
        });
      });
    });
    return styles;
  }
};
