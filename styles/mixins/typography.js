'use strict';

const breakpointHelper = require('../../lib/breakpoint-helper');

module.exports = function(config) {
  return function typographyMixin() {
    const breakpoints = Object.keys(config.breakpoints);
    const styles = {};
    const alignments = ['left', 'center', 'right', 'justify'];

    for (const breakpoint of breakpoints) {
      if (!config.breakpoints[breakpoint].default) {
        styles[breakpoint] = {};
        const block = styles[breakpoint];
        const colName = config.breakpoints[breakpoint].col;

        alignments.forEach(alignment => {
          const selector = `.text-${colName}-${alignment}`;
          block[selector] = {
            'text-align': alignment
          };
        });
      }
    }

    return breakpointHelper(styles, config);
  };
};
