module.exports = function () {
  return function (mixin, color, hoverColor) {
    return {
      a: {
        color
      },
      'a:hover': {
        color: hoverColor,
        cursor: 'pointer'
      }
    };
  };
};
