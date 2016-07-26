'use strict';

module.exports = function (config) {
  return function (mixin, color, size) {
    color = color || config.color['tooltip-bg'];
    size = size || '6px';

    const baseEffects = {
      'opacity' : 1,
      'pointer-events' : 'auto'
    };
    const xVisible = {
      '&::before' : {
        'transform' : 'translate(-50%, 0)'
      },
      '&::after' : {
        'transform' : 'translate(-50%, 0)'
      }
    };
    const yVisible = {
      '&::before' : {
        'transform' : 'translate(0, -50%)'
      },
      '&::after' : {
        'transform' : 'translate(0, -50%)'
      }
    };
    return {
      'position' : 'relative',

      '&::before' : {
        'position' : 'absolute',
        'z-index' : 10,
        'opacity' : 0,
        'content' : '" "',
        'pointer-events' : 'none',
        'transition' : 'all .18s ease-out .18s'
      },

      '&::after' : {
        'position' : 'absolute',
        'z-index' : 10,
        'opacity' : 0,
        'border-radius' : '4px',
        'padding' : '.5em 1em',
        'background-color' : color,
        'color' : '#fff',
        'font-size' : '12px',
        'white-space' : 'nowrap',
        'content' : 'attr(data-tooltip-title)',
        'pointer-events' : 'none',
        'transition' : 'all .18s ease-out .18s'
      },

      '&:hover' : {
        '&::before' : baseEffects,
        '&::after' : baseEffects
      },
      '&-visible' : {
        '&::before' : baseEffects,
        '&::after' : baseEffects
      },
      '&-break' : {
        '&::after' : {
          'white-space' : 'normal'
        }
      },
      '&-up' : {
        '&::before' : {
          'bottom' : '100%',
          'left' : '50%',
          'width' : 0,
          'height' : 0,
          'margin-bottom' : '5px',
          'border' : size + ' solid transparent',
          'border-bottom-width' : 0,
          'border-top-color' : color,
          'transform' : 'translate(-50%, 10px)',
          'transform-origin' : 'top'
        },
        '&::after' : {
          'bottom' : '100%',
          'left' : '50%',
          'margin-bottom' : ( 4 + parseInt( size, 10 ) ) + 'px',
          'transform' : 'translate(-50%, 10px)',
          'transform-origin' : 'top'
        },
        '&:hover' : xVisible,
        '&-visible' : xVisible
      },
      '&-down' : {
        '&::before' : {
          'top' : '100%',
          'left' : '50%',
          'width' : 0,
          'height' : 0,
          'margin-top' : '5px',
          'border' : size + ' solid transparent',
          'border-top-width' : 0,
          'border-bottom-color' : color,
          'transform' : 'translate(-50%, -10px)'
        },
        '&::after' : {
          'top' : '100%',
          'left' : '50%',
          'margin-top' : ( 4 + parseInt( size, 10 ) ) + 'px',
          'transform' : 'translate(-50%, -10px)'
        },
        '&:hover' : xVisible,
        '&-visible' : xVisible
      },
      '&-left' : {
        '&::before' : {
          'top' : '50%',
          'right' : '100%',
          'width' : 0,
          'height' : 0,
          'margin-right' : '5px',
          'border' : size + ' solid transparent',
          'border-right-width' : 0,
          'border-left-color' : color,
          'transform' : 'translate(10px, -50%)'
        },
        '&::after' : {
          'top' : '50%',
          'right' : '100%',
          'margin-right' : ( 4 + parseInt( size, 10 ) ) + 'px',
          'transform' : 'translate(10px, -50%)'
        },
        '&:hover' : yVisible,
        '&-visible' : yVisible
      },
      '&-right' : {
        '&::before' : {
          'top' : '50%',
          'left' : '100%',
          'height' : size,
          'margin-left' : '5px',
          'border' : size + ' solid transparent',
          'border-left-width' : 0,
          'border-right-color' : color,
          'transform' : 'translate(-10px, -50%)'
        },
        '&::after' : {
          'top' : '50%',
          'left' : '100%',
          'margin-left' : ( 4 + parseInt( size, 10 ) ) + 'px',
          'transform' : 'translate(-10px, -50%)'
        },
        '&:hover' : yVisible,
        '&-visible' : yVisible
      }
    };
  };
};
