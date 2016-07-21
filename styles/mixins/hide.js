'use strict';

const breakpointHelper = require('../../lib/breakpoint-helper');
module.exports = function (config) {
  const hideMixin = function(size) {
    const styles = {};
    const breakpoints = Object.keys(config.breakpoints);

    for (const breakpoint of breakpoints) {
      if (config.breakpoints[breakpoint].col === size) {
        styles[breakpoint] = {};
        styles[breakpoint].display = 'none';
      }
    }

    return breakpointHelper(styles, config);
  };

  return function (mixin, bp) {
    if (bp) {
      return hideMixin(bp);
    }

    const styles = {};
    const sizes = Object.keys(config.breakpoints);
    sizes.forEach((size) => {
      styles[`.hide-${config.breakpoints[size].col}`] = hideMixin(config.breakpoints[size].col);
    });

    return styles;
  };
};
