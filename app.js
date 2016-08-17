#! /usr/bin/env node
'use strict';
const path = require('path');
const yargs = require('yargs');
const Logr = require('logr');
const configHandler = require('./lib/config');
const init = require('./commands/init.js');
const reports = require('./commands/reports.js');
const run = require('./commands/run.js');
const dev = require('./commands/dev.js');
const log = new Logr({
  type: 'cli',
  renderOptions: {
    cli: {
      lineColor: 'cyan'
    }
  }
});

const argv = yargs
.option('init', {
  describe: 'create a new project directory ',
  default: false,
  type: 'string'
})
.option('options', {
  describe: 'shows the css variables and mixins that are available ',
  default: false
})
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

if (argv.init || argv._.init || argv._.indexOf('init') > -1) {
  init(argv);
  log('Done!');
  process.exit(0);
}
log(`Using local config directory: ${argv.config}`);
const defaultConf = path.join(__dirname, 'conf');

const conf = configHandler.loadConfig(defaultConf, argv, log);
if (!conf) {
  process.exit(1);
}
// show css options:
if (argv.options || argv._.options || argv._.indexOf('options') > -1) {
  reports.showOptions(conf);
// show css only:
} else if (argv.css) {
  conf.cssExpression = argv.css;
  reports.showCss(conf);
// dev mode will watch files and update when a change is made:
} else if (argv.mode === 'dev' || argv._.dev || argv._.indexOf('dev') > -1) {
  dev.runDev(defaultConf, conf, argv, log);
// normal mode will run and output the new css/js dist directory:
} else {
  if (argv.debug || argv._.indexOf('debug') > -1) {
    log(JSON.stringify(conf, null, '  '));
  }
  run.runAll(conf, log);
}
