module.exports = function (config) {
  return function (mixin, color, hoverColor) {
    color = color || config.color.body;
    hoverColor = hoverColor || color;

    return {
      float: 'right',
      'color': color,
      'font-size': '25px',
      'font-weight': 700,
      'line-height': 1,
      'text-shadow': '0 1px 0 rgb(255,255,255)',
      'opacity': '.2',

      '&:hover': {
        color: hoverColor,
        'text-decoration': 'none',
        cursor: 'pointer',
        'opacity': '.5'
      },
      '&:focus': {
        outline: 0,
        color: hoverColor,
        'text-decoration': 'none',
        cursor: 'pointer',
        'opacity': '.5'
      }
    };
  };
};
