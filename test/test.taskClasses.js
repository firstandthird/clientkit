// tests for the core ClientKitTask and task-loading system
'use strict';
const expect = require('chai').expect;
const ClientKitTask = require('../lib/task');
const WatcherTask = require('../tasks/watcher.js');
const taskLoader = require('../lib/load-tasks');
const path = require('path');

const fileToInput = path.join(__dirname, 'tasks', 'testInput.txt');
const fileToOutput = path.join(__dirname, 'tasks', 'testOutput.txt');

describe('ClientKitTask class', function() {
  it('can be extended and initialized', (done) => {
    class MyTask extends ClientKitTask {}
    const myTask = new MyTask('aTestTask', {}, {});
    expect(typeof myTask.execute).to.equal('function');
    expect(typeof myTask.options).to.equal('object');
    expect(typeof myTask.process).to.equal('function');
    expect(typeof myTask.runner).to.equal('object');
    expect(myTask.name).to.equal('aTestTask');
    done();
  });
  it('can execute a task and notify us when finished', (done) => {
    class MyTask extends ClientKitTask {
      process(output, input, processDone) {
        expect(output).to.equal(fileToOutput);
        expect(input).to.equal(fileToInput);
        processDone(null, 'this worked');
      }
    }
    const files = {};
    files[fileToInput] = fileToOutput;
    const myTask = new MyTask('aTestTask', { files }, {});
    const oldLog = console.log;
    const logResults = [];
    console.log = (data) => {
      logResults.push(data);
    };
    myTask.execute((err, result) => {
      console.log = oldLog;
      expect(err).to.equal(null);
      expect(result).to.include('this worked');
      expect(logResults.length).to.equal(2);
      expect(logResults[0]).to.include(`Processed ${fileToInput}`);
      expect(logResults[1]).to.include('Processed aTestTask');
      done();
    });
  });
});

describe('LoadTasks', function() {
  this.timeout(5000);
  it('can execute a task loaded from file', (done) => {
    const files = {};
    files[fileToInput] = fileToOutput;
    const config = {
      tasks: {
        frotz: {
          register: 'test/tasks/myTestClass.js',
          options: {
            description: 'make an inanimate object emit light',
            files
          }
        }
      }
    };
    taskLoader(config, (err, runner) => {
      expect(err).to.equal(err);
      expect(typeof runner).to.equal('object');
      expect(runner.tasks.frotz.options.description).to.include('inanimate object');
      const oldLog = console.log;
      const logResults = [];
      console.log = (data) => {
        logResults.push(data);
      };
      runner.run(['frotz']);
      setTimeout(() => {
        console.log = oldLog;
        expect(logResults.length).to.equal(3);
        expect(logResults[0]).to.include('myTestClass has executed');
        expect(logResults[1]).to.include('Processed');
        expect(logResults[2]).to.include('Processed frotz');
        done();
      }, 2000);
    });
  });
});

describe('WatcherTask class', function() {
  this.timeout(5000);
  it('can watch a list of files and run a registered task when they change', (done) => {
    // a task for the WatcherTask to run:
    const files = {};
    files[fileToInput] = fileToOutput;
    const config = {
      tasks: {
        rezrov: {
          register: 'test/tasks/myTestClass.js',
          options: {
            description: 'open locked objects',
            files
          }
        }
      }
    };
    const oldLog = console.log;
    const logResults = [];
    console.log = (data) => {
      logResults.push(data);
    };
    taskLoader(config, (err, runner) => {
      const watcherTask = new WatcherTask('watcherTask', { files }, runner);
      watcherTask.process(['rezrov'], [fileToInput], (err, result) => {
        setTimeout(() => {
          console.log = oldLog;
          console.log(logResults)
          expect(logResults.length).to.equal(4);
          expect(logResults[0]).to.include('Changed:');
          expect(logResults[1]).to.include('myTestClass has executed');
          expect(logResults[2]).to.include(`Processed ${__dirname}`);
          expect(logResults[3]).to.include('Processed :');
          done();
        }, 2000);
      });
    });
  });
});

describe('ClientKitTask implementations', function() {
  beforeEach((done) => {
    done();
  });
  afterEach((done) => {
    done();
  });

  it('eslint task', (done) => {
    done();
  });

  it('hash task', (done) => {
    done();
  });

  it('js source maps task', (done) => {
    done();
  });

  it('css source maps task', (done) => {
    done();
  });
});
