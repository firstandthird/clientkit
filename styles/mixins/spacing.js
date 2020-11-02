'use strict';

const breakpointHelper = require('../../lib/breakpoint-helper');

module.exports = function (config) {
  const spacingMixin = function(prop, position, size) {
    const styles = {};
    const spacingBreakpoints = Object.keys(config.spacing);
    const axials = {
      xaxis: ['left', 'right'],
      yaxis: ['top', 'bottom'],
      all: ['']
    };
    let positions = [position];
    if (axials[position]) {
      positions = axials[position];
    }
    const allPositions = {};

    positions.forEach(curPosition => {
      spacingBreakpoints.forEach(breakpoint => {
        const hasNoMatchingSize = typeof config.spacing[breakpoint][size] === 'undefined';
        // Do not generate extra markup to behave similarly as default
        const sizeIsDifferentThanDefault = !hasNoMatchingSize
          && breakpoint !== 'default'
          && config.spacing[breakpoint][size] === config.spacing.default[size];

        if (hasNoMatchingSize || sizeIsDifferentThanDefault) {
          return;
        }

        if (!styles[breakpoint]) {
          styles[breakpoint] = {};
        }

        if (curPosition) {
          styles[breakpoint][`${prop}-${curPosition}`] = `${config.spacing[breakpoint][size]}`;
        } else {
          styles[breakpoint][prop] = `${config.spacing[breakpoint][size]}`;
        }
      });
    });

    Object.assign(allPositions, breakpointHelper(styles, config));

    return allPositions;
  };

  return function (mixin, prop, position, size) {
    if (prop && position && size) {
      return spacingMixin(prop, position, size);
    }
    if (prop) {
      throw new Error('usage: @mixin spacing property, position, size');
    }
    const styles = {};
    const properties = ['padding', 'margin'];
    const positions = ['top', 'left', 'right', 'bottom', 'xaxis', 'yaxis'];
    const sizes = Object.keys(config.spacing.default);

    // first add the classes of the form <property>-<size>:
    properties.forEach(property => {
      sizes.forEach(curSize => {
        styles[`.${property}-${curSize}`] = spacingMixin(property, 'all', curSize);
      });
    });

    // then add the ones of the form <property>-<position>-<size>:
    properties.forEach(property => {
      positions.forEach(positionString => {
        sizes.forEach(curSize => {
          let selector = `.${property}-${positionString}-${curSize}`;

          if (property === 'margin' && positionString === 'bottom') {
            selector = `.spacing-${curSize}`;
          }

          styles[selector] = spacingMixin(property, positionString, curSize);
        });
      });
    });

    const breakpoints = Object.keys(config.breakpoints);
    const responsiveSpacing = {};

    for (const breakpoint of breakpoints) {
      if (!config.breakpoints[breakpoint].default) {
        responsiveSpacing[breakpoint] = {};
        const block = responsiveSpacing[breakpoint];

        sizes.forEach(curSize => {
          const selector = `.spacing-${breakpoint}-${curSize}`;
          block[selector] = {
            'margin-bottom': curSize === 'none' ? '0' : config.spacing.default[curSize]
          };
        });
      }
    }

    Object.assign(styles, breakpointHelper(responsiveSpacing, config));

    return styles;
  };
};
