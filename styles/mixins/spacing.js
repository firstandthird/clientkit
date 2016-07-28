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

  const axials = {
    xaxis: ['left', 'right'],
    yaxis: ['top', 'bottom'],
    all: ['top', 'bottom', 'left', 'right']
  };
  const generateAxial = (positionString, property, size) => {
    return axials[positionString].reduce((obj, axisPos, index, array) => {
      const styles = spacingMixin(property, axisPos, size);
      Object.assign(obj, styles);
      return obj;
    }, {});
  };
  return function (mixin, prop, position, size) {
    if (prop && position && size && axials[position]) {
      return generateAxial(position, prop, size);
    }
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
        styles[`.${property}-${curSize}`] = generateAxial('all', property, curSize);
      });
    });
    // then add the ones of the form <property>-<position>-<size>:
    properties.forEach((property) => {
      let addedAllProperty = false;
      positions.forEach((positionString) => {
        sizes.forEach((curSize) => {
          if (Object.keys(axials).indexOf(positionString) !== -1) {
            styles[`.${property}-${positionString}-${curSize}`] = generateAxial(positionString, property, curSize);
          } else {
            styles[`.${property}-${positionString}-${curSize}`] = spacingMixin(property, positionString, curSize);
          }
        });
        addedAllProperty = true;
      });
    });
    return styles;
  };
};
