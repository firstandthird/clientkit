// tests for the core ClientKitTask and task-loading system
'use strict';
const expect = require('chai').expect;
const taskLoader = require('../lib/load-tasks');
const path = require('path');

const fileToInput = path.join(__dirname, 'tasks', 'testInput.txt');
const fileToOutput = path.join(__dirname, 'tasks', 'testOutput.txt');

describe('CSSSourceTask', function() {
  this.timeout(5000);
  beforeEach((done) => {
    done();
  });

  afterEach((done) => {
    done();
  });

  it('can be initialized and run', (done) => {
    const conf = require('confi')({
      path: [
        './conf'
      ],
      context: {
        CKDIR: __dirname,
        CONFIGDIR: path.join(process.cwd(), 'examples/clientkit')
      }
    });

    const files = {};
    files[fileToInput] = fileToOutput;
    const config = {
      tasks: {
        css: {
          register: 'tasks/css.js',
          options: {
            description: 'compile your css',
            files,
            config: {
              color: {
                primary: '#336699'
              }
            },
            color: {
              primary: '#336699'
            },
            // core: {
            //   watch: {
            //     scripts: ['examples/scripts/sample1.js']
            //   }
            // }
          }
        }
      }
    };
    taskLoader(config, (err, runner) => {
      expect(err).to.equal(null);
      expect(typeof runner).to.equal('object');
      expect(runner.tasks.css.options.description).to.include('compile');
      const oldLog = console.log;
      const logResults = [];
      console.log = (data) => {
        logResults.push(data);
      };
      runner.run(['css']);
      setTimeout(() => {
        console.log = oldLog;
        console.log(logResults)
        // expect(logResults.length).to.equal(1);
        // expect(logResults[0]).to.include('The keyword \'const\'');
        done();
      }, 2000);
    });
  });
});
