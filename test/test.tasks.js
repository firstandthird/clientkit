// tests for the core ClientKitTask and task-loading system
'use strict';
const expect = require('chai').expect;
const taskLoader = require('../lib/load-tasks');
const path = require('path');
const fs = require('fs');
const fileToInput = path.join(__dirname, 'tasks', 'testInput.txt');
const fileToOutput = path.join(__dirname, 'tasks', 'testOutput.txt');

const options = {
  description: 'compile your css',
  color: {
    primary: '#336699'
  },
  spacing: {
    default: '1px'
  },
  grid: {
    h1: '2px'
  },
  easing: {
    left: '3px'
  },
  breakpoints: {
    b1: '2px'
  },
  dist: './dist',
  assetPath: './',
  minify: false,
  docs: {
    enabled: false
  }
};

const files = {};
files[fileToInput] = fileToOutput;

describe('CSSSourceTask', function() {
  this.timeout(10000);
  beforeEach((done) => {
    done();
  });

  afterEach((done) => {
    done();
  });

  it('can be initialized and run', (done) => {
    const config = {
      tasks: {
        css: {
          register: 'tasks/css.js',
          options
        }
      }
    };
    taskLoader(config, (err, runner) => {
      expect(err).to.equal(null);
      expect(typeof runner).to.equal('object');
      expect(runner.tasks.css.options.description).to.include('compile');
      runner.run(['css']);
      fs.writeFileSync(fileToInput, '.myClass: { background: primary; }', 'utf-8');
      setTimeout(() => {
        // const file2 = fs.readFileSync(fileToOutput);
        // console.log(file2);
      //   // expect(logResults.length).to.equal(1);
      //   // expect(logResults[0]).to.include('The keyword \'const\'');
        done();
      }, 5000);
    });
  });
});
