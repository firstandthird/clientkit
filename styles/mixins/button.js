module.exports = function () {
  return function (mixin, bgColor, color) {
    const activeBgColor = 'red';
    const styles = {};
    const state = {
      'background-color': activeBgColor
    };
    styles['background-color'] = bgColor;
    styles.color = color;
    styles['&:hover'] = state;
    styles['&:active, &.active'] = state;
    styles['&:focus'] = state;
    return styles;
  };
};
