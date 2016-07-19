'use strict';

module.exports = function(mixinStyles, breakpoints) {
  const styles = {};
  const mixinBreakpoints = Object.keys(mixinStyles);
  for (const breakpoint of mixinBreakpoints) {
    let block = styles;
    if (breakpoint !== 'default') {
      const mediaquery = `@media (min-width: ${breakpoints[breakpoint]['min-width']})`;
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
