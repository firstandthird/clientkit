'use strict';

module.exports = function (config) {
  return function (mixin, size, position) {
    const styles = {};
    position = position || 'bottom';
    const breakpoints = Object.keys(config.breakpoints);

    for (const breakpoint of breakpoints) {
      const bp = config.breakpoints[breakpoint].smallest ? null : `@media (min-width: ${config.breakpoints[breakpoint]['min-width']})`;
      let block = styles;

      if (!config.breakpoints[breakpoint].smallest) {
        styles[bp] = {};
        block = styles[bp];
      }

      const spacings = config.spacing[breakpoint] || config.spacing.default;

      block[`margin-${position}`] = spacings[size];
    }

    return styles;
  };
};
