#!/usr/bin/env node

const main = require('taskkit');
const path = require('path');

process.env.TASKKIT_PREFIX = 'clientkit';
process.env.TASKKIT_BASECONFIG = path.join(__dirname, 'conf');
process.env.TASKKIT_CKDIR = __dirname;
const task = process.argv[2] || 'default';


const run = async function() {
  try {
    await main(task);
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
};

run();
