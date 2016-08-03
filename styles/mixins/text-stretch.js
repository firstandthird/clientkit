module.exports = function ( config ) {
  return function (mixin, size) {
    size = size || config.fontStyles.default['text-stretch'];
    return {
        'letter-spacing' : size
    };
  };
};
