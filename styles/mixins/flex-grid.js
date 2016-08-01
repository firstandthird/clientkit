'use strict';

const breakpointHelper = require('../../lib/breakpoint-helper');
module.exports = function (config) {
  const horizontalAlignments = {
    'start': 'flex-start',
    'center': 'center',
    'space-around': 'space-around',
    'space-between': 'space-between'
  };
  const verticalAlignments = {
    'start': 'flex-start',
    'center': 'center',
    'end': 'flex-end',
    'stretch': 'stretch'
  };

  return function () {
    const styles = {};
    const breakpoints = Object.keys(config.breakpoints);
    const cols = config.grid.columns;
    const horizontal = Object.keys(horizontalAlignments);
    const vertical = Object.keys(verticalAlignments);

    for (const breakpoint of breakpoints) {
      const colName = config.breakpoints[breakpoint].col;

      let layoutPrefix = `layout-${colName}`;
      let prefix = `flex-${colName}`;
      if (config.breakpoints[breakpoint].default) {
        prefix = 'flex';
        layoutPrefix = 'layout';
      }

      styles[breakpoint] = {};
      const block = styles[breakpoint];

      // Layout
      block[`.${layoutPrefix}-row`] = {
        'flex-direction': 'row'
      };

      block[`.${layoutPrefix}-columns`] = {
        'flex-direction': 'column'
      };

      block[`.${layoutPrefix}-row--reverse`] = {
        'flex-direction': 'row-reverse'
      };

      block[`.${layoutPrefix}-columns--reverse`] = {
        'flex-direction': 'column-reverse'
      };

      for (const horizontalAlignment of horizontal) {
        let selector = `.${layoutPrefix}-${horizontalAlignment}`;

        for (const verticalAlignment of vertical) {
          selector += `,\n.${layoutPrefix}-${horizontalAlignment}-${verticalAlignment}`;
        }

        block[selector] = {
          'justify-content': horizontalAlignments[horizontalAlignment]
        };
      }

      for (const verticalAlignment of vertical) {
        let selector = [];

        for (const horizontalAlignment of horizontal) {
          selector.push(`.${layoutPrefix}-${horizontalAlignment}-${verticalAlignment}`);
        }

        selector = selector.join(',\n');

        block[selector] = {
          'align-content': verticalAlignments[verticalAlignment],
          'align-items': verticalAlignments[verticalAlignment]
        };
      }

      // Child
      for (let i = 1; i <= 20; i++) {
        block[`.${prefix}-order--${i}`] = {
          'order': i
        };

        block[`.${prefix}-order--${i*-1}`] = {
          'order': i*-1
        };
      }

      for (let i = 1; i <= cols; i++) {
        block[`.${prefix}-${i}`] = {
          'flex-basis': `${(100 / (12 / i))}%`
        };
      }
    }

    return breakpointHelper(styles, config);
  };
};
