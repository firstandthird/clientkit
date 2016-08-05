'use strict';
// const describe = require('mocha').describe;
// const it = require('mocha').it;
// const beforeEach = require('mocha').beforeEach;
const expect = require('chai').expect;
const path = require('path');
const fs = require('fs');
const configHandler = require('../lib/config.js');
const dev = require('../commands/dev.js');
const init = require('../commands/init.js');

const testDirectoryName = path.join(process.cwd(), 'test', 'clientkit');
const Logr = require('logr');
const log = new Logr({
  type: 'cli',
  renderOptions: {
    cli: {
      lineColor: 'cyan'
    }
  }
});
const argv = {
  config: testDirectoryName,
  _: []
};
const conf = configHandler.loadConfig(testDirectoryName, argv, log);
// helper that will replace a string in a file:
const replace = (pathToFile, stringToRemove, stringToInsert, callback) => {
  try {
    const originalText = fs.readFileSync(pathToFile).toString();
    fs.writeFileSync(pathToFile, originalText.replace(stringToRemove, stringToInsert));
    return callback(originalText);
  } catch (exc) {
    log(exc);
  }
};
init({ init: testDirectoryName });
// helpers that check if a file includes or doesn't include a string:
const includesString = (pathToFile, string) => {
  const text = fs.readFileSync(pathToFile).toString();
  expect(text).to.include(string);
};
const notIncludesString = (pathToFile, string) => {
  const text = fs.readFileSync(pathToFile).toString();
  expect(text).to.not.include(string);
};

describe('dev mode watches config files and reprocesses appropriate changes', function() {
  this.timeout(20000);
  beforeEach((done) => {
    dev.runDev(testDirectoryName, conf, argv, log);
    done();
  });
  afterEach((done) => {
    dev.stopDev();
    done();
  });
  it('will watch your config files and update the css outputs when changes are made', (done) => {
    // alter one of the config files:
    setTimeout(() => {
      replace(path.join(testDirectoryName, 'default-colors.yaml'), '#333', '#123456',
        () => {
          // verify that clientkit.css has the changes
          setTimeout(() => {
            includesString(path.join(conf.core.dist, 'clientkit.css'), '#123456');
            setTimeout(() => {
              replace(path.join(testDirectoryName, 'default-colors.yaml'), '#123456', '#333',
              () => {
                // verify that clientkit.css has the changes
                setTimeout(() => {
                  notIncludesString(path.join(conf.core.dist, 'clientkit.css'), '#123456');
                  done();
                }, 3000);
              });
            }, 3000);
          }, 3000);
        });
    }, 3000);
  });
  it('will watch your config files and add/remove watched css files when they are updated', (done) => {
    // remove core.watch.css from watchList
    replace(
      path.join(testDirectoryName, 'default-core.yaml'), `- '{{core.assetPath}}/**/*.css`, `- '{{core.assetPath}}/**/none.css`,
      () => {
        // give it a few secs to update config then change the css file
        setTimeout(() => {
          replace(path.join(process.cwd(), 'styles', 'helpers', 'ugc.css'), '.ugc', '.ugr',
          () => {
            // give it a few seconds to update css then verify the output *was not* modified
            setTimeout(() => {
              notIncludesString(path.join(conf.core.dist, 'clientkit.css'), '.ugr');
              // replace the css watcher in core.watch.css
              replace(
                path.join(testDirectoryName, 'default-core.yaml'), `- '{{core.assetPath}}/**/none.css`, `- '{{core.assetPath}}/**/*.css`,
                () => {
                  // give it a few secs to update config then change the css file
                  setTimeout(() => {
                    replace(path.join(process.cwd(), 'styles', 'helpers', 'ugc.css'), '.ugc', '.ugr',
                    () => {
                      // give it a few seconds to update css then verify the output *was* modified
                      setTimeout(() => {
                        includesString(path.join(conf.core.dist, 'clientkit.css'), '.ugr');
                        // fix it back and exit:
                        replace(path.join(process.cwd(), 'styles', 'helpers', 'ugc.css'), '.ugr', '.ugc',
                        () => {
                          done();
                        });
                      }, 4000);
                    });
                  }, 4000);
                });
            }, 4000);
          });
        }, 4000);
      }
    );
  });
});
describe('dev mode watches js files and reprocesses appropriate changes', function() {
  this.timeout(15000);
  beforeEach((done) => {
    dev.runDev(testDirectoryName, conf, argv, log);
    done();
  });
  afterEach((done) => {
    dev.stopDev();
    done();
  });
  it('will watch your js helpers and update the .js output file when a change is made', (done) => {
    // add a js file to watch list:
    fs.writeFileSync(path.join(testDirectoryName, 'default-scripts.yaml'), `scripts:
  main2.js: '{{CWD}}/examples/scripts/sample2.js'
    `);
    setTimeout(() => {
      // verify the new js exists:
      expect(fs.existsSync(path.join(conf.core.dist, 'main2.js'))).to.equal(true);
      done();
    }, 4000);
  });
});
