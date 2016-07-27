'use strict';
module.exports = function() {
  return function(mixin, img) {
    const styles = {
      'background-repeat': 'no-repeat',
      'background-position': 'center',
      'background-size': 'cover'
    };

    if (img) {
      if (img.indexOf('url(') === -1) {
        img = `url(${img})`;
      }
      styles['background-image'] = img;
    }
    return styles;
  };
};
