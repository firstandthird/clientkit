'use strict';

module.exports = function (config) {
  return function () {
    const styles = {};
    const breakpoints = Object.keys(config.breakpoints);
    const cols = 12;

    for (const breakpoint of breakpoints) {
      const constraint = config.core.mobileFirst ? 'min' : 'max';
      const width = config.breakpoints[breakpoint][`${constraint}-width`];
      const bp = config.breakpoints[breakpoint].default ? null : `@media (${constraint}-width: ${width})`;

      const colName = config.breakpoints[breakpoint].col;

      let block = styles;

      if (!config.breakpoints[breakpoint].default) {
        styles[bp] = {};
        block = styles[bp];
      }

      block['.container'] = {
        width: config.breakpoints[breakpoint].content
      };

      block['.container-bleed'] = {
        'max-width': config.breakpoints[breakpoint].bleed ? config.breakpoints[breakpoint].bleed : config.breakpoints[breakpoint].content
      };

      styles[`.col-${colName}-pull-0`] = {
        right: 'auto'
      };

      styles[`.col-${colName}-push-0`] = {
        left: 'auto'
      };

      styles[`.col-${colName}-offset-0`] = {
        'margin-left': 'auto'
      };

      for (let i = 1; i <= cols; i++) {
        styles[`.col-${colName}-${i}`] = {
          width: `${(100 / (12 / i))}%`,
          float: 'left'
        };

        block[`.col-${colName}-${i}`] = {
          width: '100%',
          float: 'none'
        };

        styles[`.col-${colName}-pull-${i}`] = {
          right: `${(100 / (12 / i))}%`
        };

        block[`.col-${colName}-pull-${i}`] = {
          right: 0
        };

        styles[`.col-${colName}-push-${i}`] = {
          left: `${(100 / (12 / i))}%`
        };

        block[`.col-${colName}-push-${i}`] = {
          left: 0
        };

        styles[`.col-${colName}-offset-${i}`] = {
          'margin-left': `${(100 / (12 / i))}%`
        };

        block[`.col-${colName}-offset-${i}`] = {
          'margin-left': 0
        };

        styles[`.col-${colName}-suffix-${i}`] = {
          'margin-right': `${(100 / (12 / i))}%`
        };

        block[`.col-${colName}-suffix-${i}`] = {
          'margin-right': 0
        };
      }
    }

    return styles;
  };
};
