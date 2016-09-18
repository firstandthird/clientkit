'use strict';
module.exports = function () {
  return function (mixin, number, borderRadius, style) {
    const selectedState = {
      'cursor': 'default'
    };
    const firstChild = {
      'border-top-right-radius': '0',
      'border-bottom-right-radius': '0'
    };
    const allChildren = {
      'border-radius': '0'
    };
    const lastChild = {
      'border-top-left-radius': '0',
      'border-bottom-left-radius': '0'
    };
    let tabStyle;
    if ( 'js' === style ) {
      tabStyle = {
        display: 'block',
        'box-sizing': 'border-box',
        'flex-grow': '3',
        'border-radius': `${borderRadius} ${borderRadius} 0 0`,
        'text-decoration': 'none',
        cursor: 'pointer',
        'user-select': 'none',
        '&:first-of-type:not(:last-of-type)': firstChild,
        '&:not(:first-of-type):not(:last-of-type)': allChildren,
        '&:last-of-type:not(:first-of-type)': lastChild,
        '&.selected': selectedState,
        '&-content': {
          'display': 'none',
          '&.selected': {
            'display': 'block'
          }
        }
      };
    } else {
      tabStyle = {
        display: 'none',
        '&:first-of-type:not(:last-of-type) + label': firstChild,
        '&:not(:first-of-type):not(:last-of-type) + label': allChildren,
        '&:last-of-type:not(:first-of-type) + label': lastChild,
        '&:checked + label': selectedState,
        '& + label': {
          'box-sizing': 'border-box',
          display: 'block',
          'flex-grow': '3',
          'border-radius': `${borderRadius} ${borderRadius} 0 0`,
          'text-decoration': 'none',
          cursor: 'pointer',
          'user-select': 'none',
        },
        '&-content': {
          position: 'absolute',
          left: 0,
          'z-index': '-1',
          width: '100%',
          'border-radius': borderRadius,
          opacity: 0,
          transform: 'translateY(-3px)'
        }
      };
    }
    const styles = {
      display: 'flex',
      'flex-wrap': 'wrap',
      'max-width': '100%',
      position: 'relative',
      'list-style': 'none',
      'border-radius': borderRadius,
      '& .tab': tabStyle
    };
    if ( 'js' !== style ) {
      const tabContentStyle = {
        position: 'relative',
        top: '0',
        'z-index': '100',
        opacity: '1',
        transform: 'translateY(0px)',
        transition: '0.5s opacity ease-in, 0.8s transform ease'
      };
      for (let i = 1; i <= number; i++) {
        styles[`& .tab:checked:nth-of-type(${i}) ~ .tab-content:nth-of-type(${i})`] = tabContentStyle;
      }
    }

    return styles;
  };
};
