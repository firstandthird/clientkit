'use strict';
/**
 * @mixin font-style small|body|large|header-X
 *
 */
module.exports = function(config) {
  const fontStylesMixin = function(size) {
    const styles = {};
    const styleBreakpoints = Object.keys(config.fontStyles);

    for (const breakpoint of styleBreakpoints) {
      let block = styles;

      if (breakpoint !== 'default') {
        const mediaquery = `@media (min-width: ${config.breakpoints[breakpoint]['min-width']})`;
        styles[mediaquery] = {};
        block = styles[mediaquery];
      }

      const sizes = config.fontStyles[breakpoint] || config.fontStyles.default;

      Object.keys(sizes[size]).forEach((property) => {
        block[property] = sizes[size][property];
      });
    }
    return styles;
  };

  return function(mixin, size) {
    console.log(size);
    if (size) {
      return fontStylesMixin(size);
    }
    const styles = {};
    console.log('hi');
    console.log(Object.keys(config.fontStyles.default));
    Object.keys(config.fontStyles.default).forEach((className) => {
      console.log(className);
      styles[`.${className}`] = fontStylesMixin(className);
    });
    return styles;
  };
};
