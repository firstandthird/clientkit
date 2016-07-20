'use strict';

const breakpointHelper = require('../../lib/breakpoint-helper');
module.exports = function (config) {
  const inputMixin = function(input) {
    const styles = {};
    const inputBreakpoints = Object.keys(config.inputs);

    for (const breakpoint of inputBreakpoints) {
      styles[breakpoint] = config.inputs[breakpoint][input];
    }
    return breakpointHelper(styles, config.breakpoints);
  };

  return function (mixin, input) {
    if (input) {
      return inputMixin(input);
    }
    const styles = {};
    Object.keys(config.inputs.default).forEach((className) => {
      styles[`.${className}`] = inputMixin(className);
    });
    return styles;
  };
};
