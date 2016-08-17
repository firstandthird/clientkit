'use strict';
const mkdirp = require('mkdirp');
const styleguide = require('../commands/styleguide.js');
const path = require('path');

module.exports.runAll = (config, log) => {
  const cssProcessor = require('../tasks/css.js');
  const jsProcessor = require('../tasks/script.js');
  // Tasks
  mkdirp.sync(config.core.dist);
  if (config.stylesheets) {
    Object.keys(config.stylesheets).forEach(style => cssProcessor.runTaskAndWrite(config, process.cwd(), style, config.stylesheets[style]));
  }
  if (config.scripts) {
    Object.keys(config.scripts).forEach(script => jsProcessor(config, process.cwd(), script, config.scripts[script]));
  }
  styleguide(
    config,
    path.join(__dirname, '..', 'lib', 'styleguide.template'),
    path.join(config.core.dist, 'styleguide.html'),
    log
  );
};
