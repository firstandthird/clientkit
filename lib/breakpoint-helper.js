'use strict';

module.exports = function(mixinStyles, config) {
  if (!config.core) {
    throw new Error('must pass in full config');
  }
  const styles = {};
  const mixinBreakpoints = Object.keys(mixinStyles);
  for (const breakpoint of mixinBreakpoints) {
    let block = styles;
    if (breakpoint !== 'default' && !config.breakpoints[breakpoint].default) {
      const constraint = config.core.mobileFirst ? 'min' : 'max';
      const width = config.breakpoints[breakpoint][`${constraint}-width`];
      const mediaquery = `@media (${constraint}-width: ${width})`;
      styles[mediaquery] = {};
      block = styles[mediaquery];
    }

    const values = mixinStyles[breakpoint] || mixinStyles.default;

    Object.keys(values).forEach((property) => {
      block[property] = values[property];
    });
  }
  return styles;
};
