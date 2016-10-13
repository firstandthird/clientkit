'use strict';
const async = require('async');
const _ = require('lodash');
const mkdirp = require('mkdirp');
const cssProcessor = require('../tasks/css.js');
const jsProcessor = require('../tasks/script.js');
const lintProcessor = require('../tasks/eslint.js');
const injector = require('../lib/injectHash');

module.exports.runAll = (config) => {
  // Tasks
  async.auto({
    mkdir: (next) => {
      mkdirp(config.core.dist, next);
    },
    css: ['mkdir', (results, next) => {
      if (config.stylesheets) {
        const styleMap = {};
        const fileKeys = Object.keys(config.stylesheets);
        async.each(fileKeys, (style, cb) => {
          cssProcessor.runTaskAndWrite(config, process.cwd(), style, config.stylesheets[style], (err, originalName, outputName) => {
            styleMap[originalName] = outputName;
            cb(null);
          });
        }, () => {
          next(null, styleMap);
        });

        return;
      }

      return next(null, null);
    }],
    javascript: ['mkdir', (results, next) => {
      if (config.scripts) {
        const fileKeys = Object.keys(config.scripts);
        const scriptMap = {};
        async.each(fileKeys, (script, cb) => {
          jsProcessor(config, process.cwd(), script, config.scripts[script], (err, originalName, outputName) => {
            scriptMap[originalName] = outputName;
            cb(null);
          });
        }, () => {
          next(null, scriptMap);
        });
        // lintProcessor(config, process.cwd());
      }
      next(null, null);
    }],
    lint: ['javascript', (results, next) => {
      if (results.javascript !== null) {
        lintProcessor(config, process.cwd());
      }
      next();
    }],
    inject: ['javascript', 'css', (results, next) => {
      const fileMap = _.defaults({}, results.css, results.javascript);
      injector(fileMap, config, next);
    }]
  });
  return;
};
