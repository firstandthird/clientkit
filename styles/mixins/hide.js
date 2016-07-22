'use strict';

const breakpointHelper = require('../../lib/breakpoint-helper');
module.exports = function (config) {
  const hideMixin = function(size, display) {
    const styles = {};
    const breakpoints = Object.keys(config.breakpoints);

    for (const breakpoint of breakpoints) {
      if (config.breakpoints[breakpoint].col === size) {
        styles[breakpoint] = {};
        styles[breakpoint].display = display;
      }
    }

    return breakpointHelper(styles, config);
  };

  return function (mixin, bp, display) {
    if (bp) {
      return hideMixin(bp, display);
    }

    const styles = {};
    const sizes = Object.keys(config.breakpoints);
    sizes.forEach((size) => {
      styles[`.hide-${config.breakpoints[size].col}`] = hideMixin(config.breakpoints[size].col, 'none');
      styles[`.show-${config.breakpoints[size].col}`] = hideMixin(config.breakpoints[size].col, 'block');
    });

    return styles;
  };
};
