'use strict';

module.exports = function (config) {
  return function () {
    const styles = {};
    const breakpoints = Object.keys(config.breakpoints);

    for (const breakpoint of breakpoints) {
      const bp = config.breakpoints[breakpoint].smallest ? null : `@media (min-width: ${config.breakpoints[breakpoint]['min-width']})`;
      let block = styles;

      if (!config.breakpoints[breakpoint].smallest) {
        styles[bp] = {};
        block = styles[bp];
      }

      if (!config.inputs[breakpoint]) {
        continue;
      }

      const classes = Object.keys(config.inputs[breakpoint]);

      for (const style of classes) {
        block[`.${style}`] = config.inputs[breakpoint][style];
      }
    }

    return styles;
  };
};
