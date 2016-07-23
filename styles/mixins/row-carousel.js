module.exports = function () {
  return function () {
    return {
      'width': '100%',
      'height': '100%',
      'white-space': 'nowrap',
      'overflow-y': 'hidden',
      'overflow': 'auto',
      '-webkit-overflow-scrolling': 'touch',
      'scroll-snap-type': 'mandatory',
      'scroll-snap-destination': '0% 100%',
      'scroll-snap-points-x': 'repeat(100%)',

      '& [class*="col-"]': {
        'display': 'inline-block',
        'float': 'none',
        'vertical-align': 'top'
      }
    }
  };
};
