'use strict';
const describe = require('mocha').describe;
const it = require('mocha').it;
const beforeEach = require('mocha').beforeEach;
const expect = require('chai').expect;
const path = require('path');
const fs = require('fs');
const init = require('../commands/init.js');
const reports = require('../commands/reports.js');
const run = require('../commands/run.js');

const testDirectoryName = path.join(process.cwd(), 'test', 'clientkit');

describe('dev mode watches config files and reprocesses appropriate changes', function() {
  beforeEach((done) => {
    done();
  });
  it('will watch your config files and change the styleguide on change', (done) => {
    done();
  });
  it('will watch your config files and add/remove watched css files when they are changed', (done) => {
    done();
  });
  it('will watch your config files and add/remove watched js files when they are changed', (done) => {
    done();
  });
  it('will watch your config files and recompile css files if they are affected', (done) => {
    done();
  });
  it('will watch your config files and recompile js files if they are affected', (done) => {
    done();
  });
});
