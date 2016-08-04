module.exports = function ( config ) {
  return function (mixin, size) {
    size = size || config.fontStyles.default['text-stretch']['letter-spacing'];
    return {
        'letter-spacing' : size
    };
  };
};
