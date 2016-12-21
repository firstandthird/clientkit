#! /usr/bin/env node
'use strict';
const path = require('path');
const yargs = require('yargs');
const Logr = require('logr');
const configLoader = require('./lib/config');
const loadTasks = require('./lib/load-tasks');

const log = new Logr({
  type: 'cli-fancy',
  reporters: {
    'cli-fancy': require('logr-cli-fancy')
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
  default: 'dev'
})
.option('config', {
  describe: 'a path to your configuration files',
  default: path.join(process.cwd(), 'clientkit')
})
.help('h')
.env(true)
.argv;

const main = () => {
  log(['clientkit'], `Using local config directory: ${path.relative(process.cwd(), argv.config)}, environment is "${argv.env}", version is ${require('./package.json').version}`);
  const clientkitConf = path.join(__dirname, 'conf');
  configLoader(clientkitConf, argv.config, argv.env, (err, conf) => {
    if (err) {
      log(['clientkit'], err);
    }
    if (!conf) {
      process.exit(1);
    }
    if (conf.core) {
      throw new Error('please upgrade your config to the new version');
    }
    let task = '';
    const cmd = argv._;
    if (cmd.length === 0) {
      task = 'default';
    } else if (cmd.length === 1) {
      task = argv._[0];
    } else {
      task = cmd;
    }
    log(['clientkit'], `Running ${task}...`);
    loadTasks(conf, log, (loadErr, runner) => {
      if (loadErr) {
        throw loadErr;
      }
      runner.run(task, (runErr) => {
        if (runErr) {
          log(['clientkit', 'error'], runErr);
        }
      });
    });
  });
};

main();
