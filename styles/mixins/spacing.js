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

      const spacing = Object.keys(config.spacing[breakpoint]);

      for (const space of spacing) {
        block[`.spacing-${space}`] = {
          'margin-bottom': config.spacing[breakpoint][space]
        };
      }
    }

    return styles;
  };
};
