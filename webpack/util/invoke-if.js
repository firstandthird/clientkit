module.exports = function invokeIf(func, condition) {
  if (condition) {
    return func();
  }
};
