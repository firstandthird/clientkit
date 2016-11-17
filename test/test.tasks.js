// tests for the core ClientKitTask and task-loading system
'use strict';
const expect = require('chai').expect;
const taskLoader = require('../lib/load-tasks');
const path = require('path');
const fileToInput = path.join(__dirname, 'tasks', 'testInput.css');
const fileToOutput = 'testOutput.css';

const files = {};
files[fileToOutput] = fileToInput;

const options = {
  description: 'compile your css',
  minify: true,
  files,
  color: {
    primary: '#336699'
  },
  spacing: {
    default: '1px'
  },
  grid: {
    // h1: '2px'
  },
  easing: {
    linear: 'cubic-bezier(0.250, 0.250, 0.750, 0.750)'
  },
  breakpoints: {
    // b1: '2px'
  },
  dist: './dist',
  assetPath: './',
  docs: {
    enabled: false
  }
};

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
      minify: true,
      tasks: {
        css: {
          register: 'tasks/css.js',
          minify: true,
          options
        }
      }
    };
    taskLoader(config, (err, runner) => {
      expect(err).to.equal(null);
      expect(typeof runner).to.equal('object');
      expect(runner.tasks.css.options.description).to.include('compile');
      runner.run(['css']);
      setTimeout(() => {
        // const file2 = fs.readFileSync(fileToOutput);
        // expect(file2).to.include('.myClass');
        done();
      }, 3000);
    });
  });
});
