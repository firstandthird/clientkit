module.exports = function (config) {
  return function () {
    const styles = {};
    const breakpoints = Object.keys(config.breakpoints);

    for (const breakpoint of breakpoints) {
      const bp = config.breakpoints[breakpoint].smallest ? '' : `@media (min-width: ${config.breakpoints[breakpoint]['min-width']})`;
      styles[bp] = {};

      const spacing = Object.keys(config.spacing[breakpoint]);

      for (const space of spacing) {
        styles[bp][`.spacing-${space}`] = {
          'margin-bottom': config.spacing[breakpoint][space]
        };
      }
    }

    return styles;
  };
};
