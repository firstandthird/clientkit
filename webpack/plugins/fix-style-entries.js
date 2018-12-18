const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries');

module.exports = new FixStyleOnlyEntriesPlugin({
  extensions: [
    'css',
    'svg'
  ],
  silent: true
});
