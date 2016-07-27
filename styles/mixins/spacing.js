'use strict';

const breakpointHelper = require('../../lib/breakpoint-helper');
module.exports = function (config) {
  const spacingMixin = function(prop, position, size) {
    const styles = {};
    const spacingBreakpoints = Object.keys(config.spacing);

    for (const breakpoint of spacingBreakpoints) {
      styles[breakpoint] = {};
      styles[breakpoint][`${prop}-${position}`] = config.spacing[breakpoint][size];
    }

    return breakpointHelper(styles, config);
  };

  return function (mixin, prop, position, size) {
    if (prop && position && size) {
      const sizeKey = size === '0' ? 'none' : size;
      return spacingMixin(prop, position, sizeKey);
    }
    if (prop) {
      throw new Error('usage: @mixin spacing property, position, size');
    }
    const styles = {};
    const properties = ['padding', 'margin'];
    const positions = ['top', 'left', 'right', 'bottom'];
    const sizes = Object.keys(config.spacing.default);
    properties.forEach((property) => {
      positions.forEach((positionString) => {
        sizes.forEach((sizeString) => {
          styles[`.${property}-${positionString}-${sizeString}`] = spacingMixin(property, positionString, sizeString);
        });
      });
    });
    return styles;
  };
};
