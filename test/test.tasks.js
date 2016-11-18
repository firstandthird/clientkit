// tests for the core ClientKitTask and task-loading system
'use strict';
const expect = require('chai').expect;
const taskLoader = require('../lib/load-tasks');
const path = require('path');
const fs = require('fs');

const fileToInput = path.join(__dirname, 'tasks', 'script1.js');
const fileToOutput = 'compiled.js';

describe('ScriptsTask', function() {
  this.timeout(5000);
  it('will run and produce a JS/JS source map', (done) => {
    const files = {};
    files[fileToOutput] = fileToInput;
    const config = {
      js: {
        files,
        minify: true,
        dist: path.join(process.cwd(), 'dist'),
        description: 'compile your js',
      },
      tasks: {
        js: path.join(process.cwd(), 'tasks/scripts.js'),
      }
    };
    taskLoader(config, (err, runner) => {
      expect(err).to.equal(null);
      expect(typeof runner).to.equal('object');
      expect(runner.tasks.js.runner).to.equal(runner);
      const oldLog = console.log;
      const logResults = [];
      console.log = (data) => {
        logResults.push(data);
        oldLog(data);
      };
      runner.run(['js'], (err2) => {
        console.log = oldLog;
        expect(logResults.length).to.equal(3);
        expect(logResults[0]).to.include('Writing file');
        expect(logResults[1]).to.include('Processed compiled.js in');
        expect(logResults[2]).to.include('Processed all js in');
        expect(err2).to.equal(null);
        const file = fs.readFileSync(path.join(process.cwd(), 'dist', fileToOutput)).toString();
        expect(file).to.include('var x=5;');
        const file2 = fs.readFileSync(path.join(process.cwd(), 'dist', `${fileToOutput}.map`)).toString();
        expect(file2).to.include('"mappings":');
        done();
      });
    });
  });
});

describe('EslintTask', function() {
  this.timeout(5000);

  it('can be initialized and run', (done) => {
    const files = [fileToInput];
    const config = {
      eslint: {
        description: 'exposes and draws attention to your bad programming habits',
        files,
        config: 'eslint-config-firstandthird',
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
      console.log = (data) => {
        logResults.push(data);
        oldLog(data);
      };
      runner.run(['eslint'], (err) => {
        expect(err).to.equal(null);
        console.log = oldLog;
        // expect(logResults.length).to.equal(1);
        // expect(logResults[0]).to.include('Unexpected var, use let or const instead');
        done();
      });
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
      css: options,
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
