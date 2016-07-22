#! /usr/bin/env node
'use strict';
const path = require('path');
const yargs = require('yargs');
const Logr = require('logr');
const watcher = require('./lib/watcher');
const mkdirp = require('mkdirp');

const log = new Logr({
  type: 'cli',
  renderOptions: {
    cli: {
      lineColor: 'cyan'
    }
  }
});

const argv = yargs
.option('css', {
  describe: 'can be used to pass in arbitrary css ',
})
.option('mode', {
  describe: 'set to "dev" mode to continuously monitor your files and auto-process when a change is made',
  default: 'prod'
})
.option('config', {
  describe: 'a path to your configuration files',
  default: path.join(process.cwd(), 'clientkit')
})
.option('debug', {
  describe: 'debug mode, will print verbose text',
  type: Boolean,
  default: false
})
.help('h')
.alias('h', 'help')
.env(true)
.argv;

log(`Using local config directory: ${argv.config}`);
const defaultConf = path.join(__dirname, 'conf');
let jsWatcher = false; // watcher we will use to watch js files
let cssWatcher = false; // the same, for css

const runAll = () => {
  // Tasks
  const cssProcessor = require('./tasks/css.js');
  const jsProcessor = require('./tasks/script.js');
  const config = loadConfig();
  const watchedScriptFiles = [
    path.join(config.core.assetPath, '**/*.js'),
  ];
  const watchedStyleFiles = [
    path.join(config.core.assetPath, '**/*.css') // @TODO: make this not sucky
  ];
  if (argv.debug || argv._.indexOf('debug') > -1) {
    log(JSON.stringify(config, null, '  '));
  }

  mkdirp.sync(config.core.dist);
  if (argv.mode === 'dev' || argv._.dev || argv._.indexOf('dev') > -1) {
    // remove any existing css file watchers:
    if (cssWatcher) {
      cssWatcher.close();
    }
    cssWatcher = watcher(watchedStyleFiles, config.stylesheets, (input, output) => {
      cssProcessor(config, __dirname, input, output);
    }, config.core.rebuildDelay);
    // remove any existing js file watchers:
    if (jsWatcher) {
      jsWatcher.close();
    }
    jsWatcher = watcher(watchedScriptFiles, config.scripts, (input, output) => {
      jsProcessor(config, __dirname, input, output);
    }, config.core.rebuildDelay);
  } else {
    if (config.stylesheets) {
      Object.keys(config.stylesheets).forEach(style => cssProcessor(config, __dirname, style, config.stylesheets[style]));
    }
    if (config.scripts) {
      Object.keys(config.scripts).forEach(script => jsProcessor(config, __dirname, script, config.scripts[script]));
    }
  }
};

const loadConfig = () => {
  return require('confi')({
    path: [
      defaultConf,
      argv.config
    ],
    context: {
      CKDIR: __dirname
    }
  });
};
const runDev = () => {
  const watchedConfigFiles = [
    path.join(defaultConf, '*'),
    path.join(argv.config, '*'),
  ];
  watcher(watchedConfigFiles, [''], () => {
    runAll();
  }, 100);
};

const evalCss = (cssExpression) => {
  // todo: probably need to actually eval the css expression
  // right now this just handles simple expressions of the form '@mixin <mixin name>'
  const tokens = argv.css.split(' ');
  const config = loadConfig();
  if (tokens[0] === '@mixin') {
    const mixinName = argv.css.split(' ')[1];
    const mixinModule = require(`./styles/mixins/${mixinName}.js`);
    const mixinString = mixinModule(config);
    return mixinString;
  }
};

// dev mode will watch your conf files and reload everything when they are changed:
if (argv.mode === 'dev' || argv._.dev || argv._.indexOf('dev') > -1) {
  runDev();
} else if (argv.css) {
  log(evalCss(argv.css));
} else {
  runAll();
}
