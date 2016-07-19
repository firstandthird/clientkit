'use strict';
/**
 * @mixin font-style small|body|large|header-X
 *
 */
const breakpointHelper = require('../../lib/breakpoint-helper');
module.exports = function(config) {
  const fontStylesMixin = function(size) {
    const styles = {};
    const styleBreakpoints = Object.keys(config.fontStyles);

    for (const breakpoint of styleBreakpoints) {
      styles[breakpoint] = config.fontStyles[breakpoint][size];
    }
    return breakpointHelper(styles, config.breakpoints);
  };

  return function(mixin, size) {
    if (size) {
      return fontStylesMixin(size);
    }
    const styles = {};
    Object.keys(config.fontStyles.default).forEach((className) => {
      styles[`.${className}`] = fontStylesMixin(className);
    });
    return styles;
  };
};
