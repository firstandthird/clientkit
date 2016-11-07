#! /usr/bin/env node
'use strict';
const path = require('path');
const yargs = require('yargs');
const Logr = require('logr');
const configLoader = require('./lib/config');
const RunTask = require('runtask');
const loadTasks = require('./lib/load-tasks');

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
.option('env', {
  describe: 'environment (eg "dev", "staging", "prod")',
  default: 'prod'
})
.option('config', {
  describe: 'a path to your configuration files',
  default: path.join(process.cwd(), 'clientkit')
})
.help('h')
.alias('h', 'help')
.env(true)
.argv;

const main = () => {
  log(`Using local config directory: ${argv.config}`);
  const defaultConf = path.join(__dirname, 'conf');
  const conf = configLoader(defaultConf, argv, log);
  if (!conf) {
    process.exit(1);
  }
  loadTasks(conf, (err, runner) => {
    if (err) {
      throw err;
    }
    runner.run(conf.execute);
  });
  /*
  const CSSTask = require('./tasks/css');
  const ScriptsTask = require('./tasks/scripts');
  const WatcherTask = require('./tasks/watcher');
  runner.register('css', new CSSTask({
    logColor: 'green',
    files: conf.stylesheets,
    color: conf.color,
    vars: conf.vars,
    breakpoints: conf.breakpoints,
    spacing: conf.spacing,
    grid: conf.grid,
    easing: conf.easing,
    core: conf.core,
    docs: conf.docs,
    autoprefixer: conf.autoprefixer
  }));

  runner.register('js', new ScriptsTask({
    logColor: 'blue',
    files: conf.scripts,
    dist: conf.core.dist,
    minify: conf.core.minify,
    shim: conf.scriptConfig.shim,
    babelIgnore: conf.scriptConfig.babelIgnore,
    globalBabel: conf.scriptConfig.globalBabel
  }));

  runner.register('watcher', new WatcherTask({
    logColor: 'yellow',
    runner,
    files: conf.core.watch,
    delay: conf.core.rebuildDelay
  }));
  */

};

main();
