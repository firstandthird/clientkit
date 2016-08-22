// removes embedded source maps in output css/js files:
module.exports = (text, type) => {
  if (type === 'css') {
    const replaceStart = text.indexOf('/*# sourceMappingURL=');
    const replaceEnd = text.indexOf('css.map */') + 10;
    const toReplace = text.substring(replaceStart, replaceEnd);
    return text.replace(toReplace, '');
  }
  return text.split('//# sourceMappingURL=')[0];
};
