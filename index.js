#!/usr/bin/env node
/* eslint-disable no-console */
const { fork } = require('child_process');
const path = require('path');

const run = () => {
  const taskName = process.argv[2] || '';
  const tagName = process.argv[3] || '';
  const child = fork(path.resolve(__dirname, 'webpack.js'), [taskName, tagName]);

  child.on('message', message => {
    child.kill();
    console.log('Reloading config');
    run();
  });
};

run();
