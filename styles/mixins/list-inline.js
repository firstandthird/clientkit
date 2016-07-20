module.exports = function () {
  return function (mixin, spacing) {
    var spacing = spacing || '5px';
    return {
      'margin-left': '-' + spacing,
      'padding-left': 0,
      'list-style': 'none',

      '& > li': {
        'display': 'inline-block',
        'padding-right': spacing,
        'padding-left': spacing
      }
    };
  };
};

