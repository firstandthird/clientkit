'use strict';

module.exports = function (config) {
  return function () {
    const styles = {};
    const breakpoints = Object.keys(config.breakpoints);
    const cols = 12;

    for (const breakpoint of breakpoints) {
      // Smallest doesn't get wrapped in a mediaquery
      const bp = config.breakpoints[breakpoint].smallest ? '' : `@media (min-width: ${config.breakpoints[breakpoint]['min-width']})`;
      const colName = config.breakpoints[breakpoint].col;
      styles[bp] = {
        '.container': {
          width: config.breakpoints[breakpoint].content
        }
      };

      // If the breakpoint doesn't have a col name we shouldn't do anything
      if (!colName) {
        styles[bp]['.container-bleed'] = {
          width: '100%'
        };

        continue;
      }

      // Biggest size is 100% but we dont want that in the media query
      styles[bp]['.container-bleed'] = {
        width: config.breakpoints[breakpoint].content
      };

      styles[bp][`.col-${colName}-pull-0`] = {
        right: 'auto'
      };

      styles[bp][`.col-${colName}-push-0`] = {
        left: 'auto'
      };

      styles[bp][`.col-${colName}-offset-0`] = {
        'margin-left': 'auto'
      };

      for (let i = 1; i <= cols; i++) {
        styles[bp][`.col-${colName}-${i}`] = {
          width: `${(100 / (12 / i))}%`,
          float: 'left'
        };

        styles[bp][`.col-${colName}-pull-${i}`] = {
          right: `${(100 / (12 / i))}%`
        };

        styles[bp][`.col-${colName}-push-${i}`] = {
          left: `${(100 / (12 / i))}%`
        };

        styles[bp][`.col-${colName}-offset-${i}`] = {
          'margin-left': `${(100 / (12 / i))}%`
        };
      }
    }

    // Move items in the '' breakpoint to be root
    for (const style of Object.keys(styles[''])) {
      styles[style] = styles[''][style];
    }

    delete styles[''];

    return styles;
  };
};
