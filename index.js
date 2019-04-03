#!/usr/bin/env node
const { fork } = require('child_process');
const path = require('path');

const run = () => {
  const taskName = process.argv[2] || '';
  const tagName = process.argv[3] || '';
  const child = fork(path.resolve(__dirname, 'webpack.js'), [taskName, tagName]);

  child.on('message', message => {
    child.kill();
    run();
  });
};

run();
