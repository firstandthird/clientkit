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
  if (!conf.tasks) {
    throw new Error('please upgrade your config to the new version');
  }
  loadTasks(conf, (err, runner) => {
    if (err) {
      throw err;
    }
    runner.run(conf.execute);
  });
};

main();
