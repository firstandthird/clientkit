'use strict';

module.exports = function (config) {
  return function (mixin, type) {
    return config.inputs[type];
  }
};
