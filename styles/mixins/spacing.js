'use strict';

const breakpointHelper = require('../../lib/breakpoint-helper');
module.exports = function (config) {
  const spacingMixin = function(prop, position, size) {
    const styles = {};
    const spacingBreakpoints = Object.keys(config.spacing);

    for (const breakpoint of spacingBreakpoints) {
      styles[breakpoint] = {};
      const sizeKey = size === '0' ? 'none' : size;
      styles[breakpoint][`${prop}-${position}`] = config.spacing[breakpoint][sizeKey];
    }

    return breakpointHelper(styles, config);
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
          styles[`.${property}-${position}-${size}`] = spacingMixin(property, position, size);
        });
      });
    });
    return styles;
  }
};
