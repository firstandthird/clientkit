'use strict';

const breakpointHelper = require('../../lib/breakpoint-helper');
module.exports = function (config) {
  const spacingMixin = function(prop, position, size) {
    const styles = {};
    const spacingBreakpoints = Object.keys(config.spacing);

    for (const breakpoint of spacingBreakpoints) {
      styles[breakpoint] = {};
      if (typeof position === 'string') {
        styles[breakpoint][`${prop}-${position}`] = config.spacing[breakpoint][size];
      } else {
        position.forEach((pos) => {
          styles[breakpoint][`${prop}-${pos}`] = config.spacing[breakpoint][size];
        });
      }
    }

    return breakpointHelper(styles, config);
  };


  return function (mixin, prop, position, size) {
    if (prop && position && size) {
      return spacingMixin(prop, position, size);
    }
    const styles = {};
    const properties = ['padding', 'margin'];
    const positions = ['top', 'left', 'right', 'bottom', 'xaxis', 'yaxis'];
    const sizes = Object.keys(config.spacing.default);
    const axials = {
      xaxis: ['left', 'right'],
      yaxis: ['top', 'bottom']
    };
    properties.forEach((property) => {
      let addedAllProperty = false;
      positions.forEach((positionString) => {
        sizes.forEach((size) => {
          if (!addedAllProperty) {
            addedAllProperty = true;
            styles[`.${property[0]}-${size}`] = spacingMixin(property, positionString, size);
          }
          if (Object.keys(axials).indexOf(positionString) > -1) {
            styles[`.${property}-${positionString[0]}-${size}`] = spacingMixin(property, axials[positionString], size);
          } else {
            styles[`.${property}-${positionString[0]}-${size}`] = spacingMixin(property, positionString, size);
          }
        });
      });
    });
    return styles;
  };
};
