// tests for the core ClientKitTask and task-loading system
'use strict';
const expect = require('chai').expect;
const taskLoader = require('../lib/load-tasks');
const path = require('path');

const fileToInput = path.join(__dirname, 'tasks', 'script1.js');

describe('EslintTask', function() {
  this.timeout(5000);

  it('can be initialized and run', (done) => {
    const files = [fileToInput];
    const config = {
      eslint: {
        description: 'exposes and draws attention to your bad programming habits',
        files,
        eslint: 'eslint-config-firstandthird',
        eslintIgnore: []
      },
      tasks: {
        eslint: path.join(process.cwd(), 'tasks/eslint.js'),
      }
    };
    taskLoader(config, (err, runner) => {
      expect(err).to.equal(null);
      expect(typeof runner).to.equal('object');
      expect(runner.tasks.eslint.options.description).to.include('bad programming habits');
      const oldLog = console.log;
      const logResults = [];
      // console.log = (data) => {
      //   logResults.push(data);
      // };
      runner.run(['eslint']);
      setTimeout(() => {
        console.log = oldLog;
        expect(logResults.length).to.equal(1);
        expect(logResults[0]).to.include('Unexpected var, use let or const instead');
        done();
      }, 2000);
    });
  });
});

describe('CSSSourceTask', function() {
  const fileToInput = path.join(__dirname, 'tasks', 'testInput.css');
  const fileToOutput = 'testOutput.css';
  const fs = require('fs');
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
  this.timeout(10000);

  it('can be initialized and run', (done) => {
    const config = {
      css: {
        minify: true,
        options
      },
      tasks: {
        css: path.join(process.cwd(), 'tasks/css.js')
      }
    };
    taskLoader(config, (err, runner) => {
      expect(err).to.equal(null);
      expect(typeof runner).to.equal('object');
      expect(runner.tasks.css.options.description).to.include('compile');
      runner.run(['css']);
      setTimeout(() => {
        const file2 = fs.readFileSync(path.join(process.cwd(), 'dist', fileToOutput)).toString();
        expect(file2).to.include('.myClass');
        done();
      }, 3000);
    });
  });
});
