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
    const styles = {};
    const properties = ['padding', 'margin'];
    const positions = ['top', 'left', 'right', 'bottom', 'xaxis', 'yaxis'];
    const sizes = Object.keys(config.spacing.default);
    const axials = {
      xaxis: ['left', 'right'],
      yaxis: ['top', 'bottom'],
      all: ['top', 'bottom', 'left', 'right']
    };
    // first add the classes of the form <propery>-<size>:
    properties.forEach((property) => {
      sizes.forEach((curSize) => {
        styles[`.${property}-${curSize}`] = axials.all.reduce((obj, axisPos, index, array) => {
          const styles = spacingMixin(property, axisPos, curSize);
          Object.assign(obj, styles);
          return obj;
        }, {});
      });
    });
    // then add the ones of the form <property>-<position>-<size>:
    properties.forEach((property) => {
      let addedAllProperty = false;
      positions.forEach((positionString) => {
        sizes.forEach((curSize) => {
          if (Object.keys(axials).indexOf(positionString) !== -1) {

            styles[`.${property}-${positionString}-${curSize}`] = axials[positionString].reduce((obj, axisPos, index, array) => {
              const styles = spacingMixin(property, axisPos, curSize);
              Object.assign(obj, styles);
              return obj;
            }, {});

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
