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
      return spacingMixin(prop, position, size);
    }
    if (prop) {
      throw new Error('usage: @mixin spacing property, position, size');
    }
    const styles = {};
    const properties = ['padding', 'margin'];
    const positions = ['top', 'left', 'right', 'bottom'];
    const sizes = Object.keys(config.spacing.default);
    properties.forEach((property) => {
      positions.forEach((position) => {
        sizes.forEach((size) => {
          styles[`.${property[0]}-${position[0]}-${size}`] = spacingMixin(property, position, size);
        });
      });
    });
    return styles;
  }
};
