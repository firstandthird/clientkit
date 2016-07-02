module.exports = function () {
  return function (mixin, bgColor, color) {
    return {
      'background-color': bgColor,
      color,
      display: 'inline-block',
      'line-height': 1
    };
  };
};
