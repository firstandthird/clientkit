'use strict';

const breakpointHelper = require('../../lib/breakpoint-helper');
module.exports = function (config) {
  const spacingMixin = function(prop, position, size) {
    const styles = {};
    const spacingBreakpoints = Object.keys(config.spacing);
    const axials = {
      xaxis: ['left', 'right'],
      yaxis: ['top', 'bottom'],
      all: ['top', 'bottom', 'left', 'right']
    };
    let positions = [position];
    if (axials[position]) {
      positions = axials[position];
    }
    const allPositions = {};
    positions.forEach((curPosition, index) => {
      for (const breakpoint of spacingBreakpoints) {
        styles[breakpoint] = {};
        styles[breakpoint][`${prop}-${curPosition}`] = `${config.spacing[breakpoint][size]}`;
      }
      Object.assign(allPositions, breakpointHelper(styles, config));
    });
    return allPositions;
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
    const positions = ['top', 'left', 'right', 'bottom', 'xaxis', 'yaxis'];
    const sizes = Object.keys(config.spacing.default);
    // first add the classes of the form <propery>-<size>:
    properties.forEach((property) => {
      sizes.forEach((curSize) => {
        styles[`.${property}-${curSize}`] = spacingMixin(property, 'all', curSize);
      });
    });
    // then add the ones of the form <property>-<position>-<size>:
    properties.forEach((property) => {
      positions.forEach((positionString) => {
        sizes.forEach((curSize) => {
          styles[`.${property}-${positionString}-${curSize}`] = spacingMixin(property, positionString, curSize);
        });
      });
    });
    return styles;
  };
};
