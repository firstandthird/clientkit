module.exports = function(config) {
  return function() {
    if (!config.siteMaxWidth) {
      return {};
    }
    return {
      'max-width': config.siteMaxWidth,
      'margin-left': 'auto',
      'margin-right': 'auto'
    };
  };
};
