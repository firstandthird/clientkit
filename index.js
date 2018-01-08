#!/usr/bin/env node

const main = require('taskkit');
const path = require('path');

process.env.TASKKIT_PREFIX = 'clientkit'
process.env.TASKKIT_BASECONFIG = path.join(__dirname, 'conf');
process.env.TASKKIT_CKDIR = __dirname;
const task = process.argv[2] || 'default';
process.on('unhandledRejection', r => console.log(r));
main(task);
