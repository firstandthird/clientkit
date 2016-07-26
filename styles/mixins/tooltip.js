module.exports = function () {
  return function (mixin, color) {
    var color = color || 'rgba(17,17,17,.9)';
    return {
      'position': 'relative',

      '&::before': {
        'position': 'absolute',
        'z-index': 10,
        'opacity': 0,
        'content': '" "',
        'pointer-events': 'none',
        'transition': 'all .18s ease-out .18s'
      },

      '&::after': {
        'position': 'absolute',
        'z-index': 10,
        'opacity': 0,
        'border-radius': '4px',
        'padding': '.5em 1em',
        'background-color': color,
        'color': '#fff',
        'font-size': '12px',
        'white-space': 'nowrap',
        'content': 'attr(data-tooltip-title)',
        'pointer-events': 'none',
        'transition': 'all .18s ease-out .18s'
      }

    };
  };
};


