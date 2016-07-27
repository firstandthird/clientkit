'use strict';
module.exports = function () {
  return function (mixin, bgColor, fgColor, type) {

    const styles = {
      display: 'inline-block',
      'line-height': 1,
      'text-align': 'center',
      'font-size': '14px',
      padding: '12px 14px',
      'border-radius': '3px',
      'vertical-align': 'middle',
      cursor: 'pointer',
      transition: 'color 250ms cubic-bezier(0.250, 0.460, 0.450, 0.940), background-color 250ms cubic-bezier(0.250, 0.460, 0.450, 0.940)',
      color: fgColor,
    }

    let state = {};
    if (type === 'outline') {
      styles['background-color'] = 'transparent';
      styles.border = `2px solid ${bgColor}`;
      styles.color = bgColor;
      state = {
        'background-color': bgColor,
        color: fgColor
      }
    } else {
      styles.border = 0;
      styles['background-color'] = bgColor;
      state = {
        'background-color': `color(${bgColor} blackness(20%))`,
        color: '#fff' //TODO: pass this in?
      }
    }

    styles['&:hover'] = state;
    styles['&:active, &.active'] = state;
    styles['&:focus'] = state;

    return styles;
  };
};
