'use strict';

module.exports = function(mixinStyles, config) {
  if (!config) {
    throw new Error('must pass in full config');
  }
  const styles = {};
  const mixinBreakpoints = Object.keys(mixinStyles);
  for (const breakpoint of mixinBreakpoints) {
    let block = styles;
    const values = mixinStyles[breakpoint];
    if (!values) {
      continue;
    }
    if (breakpoint !== 'default' && !config.breakpoints[breakpoint].default) {
      const constraint = config.mobileFirst ? 'min' : 'max';
      const width = config.breakpoints[breakpoint][`${constraint}-width`];
      const mediaquery = `@media (${constraint}-width: ${width})`;
      styles[mediaquery] = {};
      block = styles[mediaquery];
    }


    Object.keys(values).forEach((property) => {
      block[property] = values[property];
    });
  }
  return styles;
};
