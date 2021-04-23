const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');

module.exports = new RemoveEmptyScriptsPlugin({
  extensions: [
    'css',
    'svg'
  ]
});
