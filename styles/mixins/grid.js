'use strict';

const breakpointHelper = require('../../lib/breakpoint-helper');
module.exports = function (config) {
  return function () {
    const styles = {};
    const breakpoints = Object.keys(config.breakpoints);
    const cols = config.grid.columns;
    const gutters = config.grid.gutters;

    for (const breakpoint of breakpoints) {
      const colName = config.breakpoints[breakpoint].col;

      let prefix = `col-${colName}`;
      if (config.breakpoints[breakpoint].default) {
        prefix = 'col';
      }

      styles[breakpoint] = {};
      const block = styles[breakpoint];

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
          float: 'left',
          position: 'relative',
          'min-height': '1px',
          'padding-left': gutters,
          'padding-right': gutters
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
        if (colName === 'sm') {
          block[`.row-carousel-peekaboo .${prefix}-${i}`] = {
            width: `${(100 / (12 / i) - 15)}%`
          };
        }
        if (colName === 'md') {
          block[`.row-carousel-peekaboo .${prefix}-${i}`] = {
            width: `${(100 / (12 / i) - 5)}%`
          };
        }
      }
      block[`.${prefix}-plain`] = {
        'padding-right': 0,
        'padding-left': 0
      };
    }

    return breakpointHelper(styles, config);
  };
};
