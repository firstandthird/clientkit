'use strict';

const breakpointHelper = require('../../lib/breakpoint-helper');
module.exports = function (config) {
  return function () {
    const styles = {};
    const breakpoints = Object.keys(config.breakpoints);
    const cols = 12;

    for (const breakpoint of breakpoints) {
      const colName = config.breakpoints[breakpoint].col;

      let prefix = `col-${colName}`;
      if (config.breakpoints[breakpoint].default) {
        prefix = 'col';
      }

      styles[breakpoint] = {};
      const block = styles[breakpoint];


      block['.container'] = {
        width: config.breakpoints[breakpoint].content,
        'box-sizing': 'border-box'
      };

      block['.container-bleed'] = {
        'max-width': config.breakpoints[breakpoint].bleed ? config.breakpoints[breakpoint].bleed : config.breakpoints[breakpoint].content
      };

      block[`.${prefix}-pull-0`] = {
        right: 'auto'
      };

      block[`.${prefix}-push-0`] = {
        left: 'auto'
      };

      block[`.${prefix}-offset-0`] = {
        'margin-left': 'auto'
      };

      for (let i = 1; i <= cols; i++) {
        block[`.${prefix}-${i}`] = {
          width: `${(100 / (12 / i))}%`,
          float: 'left'
        };

        block[`.${prefix}-pull-${i}`] = {
          right: `${(100 / (12 / i))}%`
        };

        block[`.${prefix}-push-${i}`] = {
          left: `${(100 / (12 / i))}%`
        };

        block[`.${prefix}-offset-${i}`] = {
          'margin-left': `${(100 / (12 / i))}%`
        };

        block[`.${prefix}-suffix-${i}`] = {
          'margin-right': `${(100 / (12 / i))}%`
        };
      }
    }

    return breakpointHelper(styles, config);
  };
};
