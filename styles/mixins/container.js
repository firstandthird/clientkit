'use strict';

const breakpointHelper = require('../../lib/breakpoint-helper');
module.exports = function (config) {
  return function() {
    const styles = {};
    const breakpoints = Object.keys(config.breakpoints);
    const gutters = config.grid.gutters;

    styles['default'] = {
      'box-sizing': 'border-box',
      'margin-left': 'auto',
      'margin-right': 'auto',
      'padding-left': gutters,
      'padding-right': gutters
    };

    for (const breakpoint of breakpoints) {
      styles[breakpoint] = {
        width: config.breakpoints[breakpoint].content,
      };
    }

    return breakpointHelper(styles, config);
  };
};
