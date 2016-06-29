'use strict';

module.exports = function (config) {
  return function () {
    const styles = {};
    const breakpoints = Object.keys(config.breakpoints);
    const cols = 12;

    for (const breakpoint of breakpoints) {
      // Smallest doesn't get wrapped in a mediaquery
      const bp = config.breakpoints[breakpoint].smallest ? null : `@media (min-width: ${config.breakpoints[breakpoint]['min-width']})`;
      const colName = config.breakpoints[breakpoint].col;

      let block = styles;

      if (!config.breakpoints[breakpoint].smallest) {
        styles[bp] = {};
        block = styles[bp];
      }

      block['.container'] = {
        width: config.breakpoints[breakpoint].content
      };

      // If the breakpoint doesn't have a col name we shouldn't do anything
      if (!colName) {
        block['.container-bleed'] = {
          width: '100%'
        };

        continue;
      }

      // Biggest size is 100% but we dont want that in the media query
      block['.container-bleed'] = {
        width: config.breakpoints[breakpoint].content
      };

      block[`.col-${colName}-pull-0`] = {
        right: 'auto'
      };

      block[`.col-${colName}-push-0`] = {
        left: 'auto'
      };

      block[`.col-${colName}-offset-0`] = {
        'margin-left': 'auto'
      };

      for (let i = 1; i <= cols; i++) {
        block[`.col-${colName}-${i}`] = {
          width: `${(100 / (12 / i))}%`,
          float: 'left'
        };

        block[`.col-${colName}-pull-${i}`] = {
          right: `${(100 / (12 / i))}%`
        };

        block[`.col-${colName}-push-${i}`] = {
          left: `${(100 / (12 / i))}%`
        };

        block[`.col-${colName}-offset-${i}`] = {
          'margin-left': `${(100 / (12 / i))}%`
        };
      }
    }

    return styles;
  };
};
