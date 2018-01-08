'use strict';

const breakpointHelper = require('../../lib/breakpoint-helper');
module.exports = function (config) {
  const horizontalAlignments = {
    left: 'flex-start',
    right: 'flex-end',
    center: 'center',
    'space-around': 'space-around',
    'space-between': 'space-between',
    baseline: 'baseline'
  };
  const verticalAlignments = {
    top: 'flex-start',
    center: 'center',
    bottom: 'flex-end',
    stretch: 'stretch',
    baseline: 'baseline'
  };

  const layouts = {
    columns: {
      'flex-direction': 'column'
    },
    wrap: {
      'flex-wrap': 'wrap'
    },
    reverse: {
      'flex-direction': 'row-reverse'
    },
    'columns-reverse': {
      'flex-direction': 'column-reverse'
    }
  };

  return function () {
    const styles = {};
    const breakpoints = Object.keys(config.breakpoints);
    const cols = config.grid.columns;
    const horizontal = Object.keys(horizontalAlignments);
    const vertical = Object.keys(verticalAlignments);

    for (const breakpoint of breakpoints) {
      const colName = config.breakpoints[breakpoint].col;

      let layoutPrefix = `flex-row-${colName}`;
      let prefix = `flex-${colName}`;
      if (config.breakpoints[breakpoint].default) {
        prefix = 'flex';
        layoutPrefix = 'flex-row';
      }

      styles[breakpoint] = {};
      const block = styles[breakpoint];

      // Layout
      let layoutSelector = `.${layoutPrefix}`;
      Object.keys(layouts).forEach(layout => {
        const selector = `.${layoutPrefix}-${layout}`;
        layoutSelector += `,\n${selector}`;
        block[selector] = layouts[layout];
      });
      block[layoutSelector] = {
        display: 'flex',
        'margin-left': '-15px',
        'margin-right': '-15px'
      };

      for (const horizontalAlignment of horizontal) {
        let selector = `.${prefix}-${horizontalAlignment}`;

        for (const verticalAlignment of vertical) {
          selector += `,\n.${prefix}-${horizontalAlignment}-${verticalAlignment}`;
        }

        block[selector] = {
          'justify-content': horizontalAlignments[horizontalAlignment]
        };
      }

      for (const verticalAlignment of vertical) {
        let selector = [];

        for (const horizontalAlignment of horizontal) {
          selector.push(`.${prefix}-${horizontalAlignment}-${verticalAlignment}`);
        }

        selector = selector.join(',\n');

        block[selector] = {
          'align-content': verticalAlignments[verticalAlignment],
          'align-items': verticalAlignments[verticalAlignment]
        };
      }

      // Child
      block[`.${prefix}-order-first`] = {
        order: -1
      };

      block[`.${prefix}-order-last`] = {
        order: 1
      };

      block[`.${prefix}-shrink`] = {
        'flex-shrink': 1
      };

      block[`.${prefix}-no-shrink`] = {
        'flex-shrink': 0
      };

      block[`.${prefix}-grow`] = {
        'flex-grow': 1
      };

      block[`.${prefix}-no-grow`] = {
        'flex-grow': 0
      };

      for (let i = 1; i <= cols; i++) {
        block[`.${prefix}-${i}`] = {
          width: `${(100 / (12 / i))}%`,
          'flex-basis': `${(100 / (12 / i))}%`,
          'padding-left': '15px',
          'padding-right': '15px'
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
