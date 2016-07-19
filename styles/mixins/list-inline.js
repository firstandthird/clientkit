module.exports = function () {
  return function (mixin) {
    return {
      'margin-left': '-5px',
      'padding-left': 0,
      'list-style': 'none',

      '& > li': {
        'display': 'inline-block',
        'padding-right': '5px',
        'padding-left': '5px'
      }
    };
  };
};

