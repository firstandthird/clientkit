'use strict';
/**
 * @mixin font-size small|body|large|header-X
 *
 */
module.exports = function(config) {
  return function(mixin, size) {
    const styles = {};
    //TODO: refactor to only output overrides - loop over fontSizes breakpoints
    const breakpoints = Object.keys(config.breakpoints);

    for (const breakpoint of breakpoints) {
      const bp = config.breakpoints[breakpoint].smallest ? null : `@media (min-width: ${config.breakpoints[breakpoint]['min-width']})`;
      let block = styles;


      if (!config.breakpoints[breakpoint].smallest) {
        styles[bp] = {};
        block = styles[bp];
      }

      const sizes = config.fontSizes[breakpoint] || config.fontSizes.default;

      Object.keys(sizes[size]).forEach((property) => {
        block[property] = sizes[size][property];
      });
    }

    return styles;
  };
};
