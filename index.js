const path = require('path');
const main = require('clientkit-core');

// clientkit-core can be given a list of additional directories containing
// configuration files and a list of additional plugin directories
main({
  confDirectories: [path.join(__dirname, 'conf')],
  pluginDirectories: [path.join(__dirname, 'tasks')]
});
