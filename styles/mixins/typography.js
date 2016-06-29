module.exports = function (config) {
  return function () {
    const styles = {};
    const breakpoints = Object.keys(config.breakpoints);

    for (const breakpoint of breakpoints) {
      const bp = config.breakpoints[breakpoint].smallest ? '' : `@media (min-width: ${config.breakpoints[breakpoint]['min-width']})`;
      styles[bp] = {};

      const classes = Object.keys(config.fontStyles[breakpoint]);

      for (const style of classes) {
        styles[bp][`.${style}`] = config.fontStyles[breakpoint][style];
      }
    }

    return styles;
  };
};
