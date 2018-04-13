'use strict';

module.exports = function (config) {
  return function (mixin, size, direction) {
    if (!size) {
      size = '4px';
    }
    let borders;
    const styles = {
      display: 'inline-block',
      width: 0,
      height: 0,
      'vertical-align': 'middle',
      content: '""'
    };

    if (!direction || direction === 'down') {
      borders = {
        'border-top': `${size} solid`,
        'border-right': `${size} solid transparent`,
        'border-left': `${size} solid transparent`
      };
    }
    if (direction === 'up') {
      borders = {
        'border-bottom': `${size} solid`,
        'border-right': `${size} solid transparent`,
        'border-left': `${size} solid transparent`
      };
    }
    if (direction === 'right') {
      borders = {
        'border-left': `${size} solid`,
        'border-top': `${size} solid transparent`,
        'border-bottom': `${size} solid transparent`
      };
    }
    if (direction === 'left') {
      borders = {
        'border-right': `${size} solid`,
        'border-top': `${size} solid transparent`,
        'border-bottom': `${size} solid transparent`
      };
    }

    return Object.assign(styles, borders);
  };
};
