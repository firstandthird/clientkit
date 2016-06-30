module.exports = function () {
  return function (mixin, color, hoverColor) {
    return {
      a: {
        color,
        'text-decoration': 'none'
      },
      'a:hover': {
        color: hoverColor,
        cursor: 'pointer'
      }
    };
  };
};
