// tests for the core ClientKitTask and task-loading system
'use strict';
const expect = require('chai').expect;
const taskLoader = require('../lib/load-tasks');
const path = require('path');

const fileToInput = path.join(__dirname, 'tasks', 'testInput.txt');
const fileToOutput = path.join(__dirname, 'tasks', 'testOutput.txt');

describe('EslintTask', function() {
  this.timeout(5000);
  beforeEach((done) => {
    done();
  });

  afterEach((done) => {
    done();
  });

  it('can be initialized and run', (done) => {
    const files = {};
    files[fileToInput] = fileToOutput;
    const config = {
      tasks: {
        eslint: {
          register: 'tasks/eslint.js',
          options: {
            description: 'exposes and draws attention to your bad programming habits',
            files,
            core: {
              watch: {
                scripts: ['examples/scripts/sample1.js']
              }
            }
          }
        }
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
      };
      runner.run(['eslint']);
      setTimeout(() => {
        console.log = oldLog;
        expect(logResults.length).to.equal(1);
        expect(logResults[0]).to.include('The keyword \'const\'');
        done();
      }, 2000);
    });
  });
});
