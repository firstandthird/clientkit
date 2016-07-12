module.exports = function () {
  return function (mixin, color) {
    const styles = {};
    const state = {
      'background-color': color,
      color: '#fff'
    };
    styles['background-color'] = 'transparent';
    styles.color = color;
    styles['border-color'] = color;
    styles['&:hover'] = state;
    styles['&:active, &.active'] = state;
    styles['&:focus'] = state;
    return styles;
  };
};
