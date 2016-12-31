// 'use strict';
// const expect = require('chai').expect;
// const path = require('path');
// const fs = require('fs');
// const rimraf = require('rimraf');
// const handleConfig = require('../lib/config.js');
// const init = require('../commands/init.js');
// const reports = require('../commands/reports.js');
// const run = require('../commands/run.js');
//
// const testDirectoryName = path.join(process.cwd(), 'test', 'clientkit');
// const Logr = require('logr');
// const log = new Logr({
//   type: 'cli',
//   renderOptions: {
//     cli: {
//       lineColor: 'cyan'
//     }
//   }
// });
//
// describe('handles --init command-line option', function() {
//   beforeEach((done) => {
//     if (fs.existsSync(testDirectoryName)) {
//       rimraf.sync(testDirectoryName);
//     }
//     done();
//   });
//   it('will init a new directory passed as a command line option', (done) => {
//     init({ init: testDirectoryName });
//     expect(fs.existsSync(testDirectoryName)).to.equal(true);
//     const file = fs.readFileSync(path.join(testDirectoryName, 'default-core.yaml')).toString();
//     expect(file).to.include('core:');
//     done();
//   });
// });
//
// describe('handles --options command-line option', function() {
//   it('shows options', (done) => {
//     const previousConsole = console.log;
//     let lastMessage = '';
//     console.log = (input) => {
//       lastMessage += input;
//     };
//     reports.showOptions(handleConfig.loadConfig(path.join(__dirname, 'conf'), {
//       config: path.join(process.cwd(), 'test', 'clientkit'),
//       _: []
//     }, log));
//     expect(lastMessage).to.include('Available Mixins');
//     expect(lastMessage).to.include('Available Variables');
//     expect(lastMessage).to.include('Custom Media');
//     console.log = previousConsole;
//     done();
//   });
// });
//
// describe('handles --css command-line option', function() {
//   this.timeout(8000);
//   it('handles when css is passed as command-line option', (done) => {
//     const previousConsole = console.log;
//     let lastMessage = '';
//     console.log = (input) => {
//       lastMessage += input;
//     };
//     const config = handleConfig.loadConfig(path.join(process.cwd(), 'conf'), {
//       config: path.join(process.cwd(), 'conf'),
//       _: []
//     }, log);
//
//     config.cssExpression = '@mixin spacing';
//     reports.showCss(config);
//     setTimeout(() => {
//       console.log = previousConsole;
//       expect(lastMessage).to.include('.padding-xl');
//       expect(lastMessage).to.include('.padding-top-sm');
//       expect(lastMessage).to.include('.padding-xaxis-none');
//       done();
//     }, 3000);
//   });
// });
//
// describe('handles loading config files', function() {
//   it(' can load a valid config', (done) => {
//     const config = handleConfig.loadConfig(testDirectoryName, {
//       config: `${process.cwd()}`,
//       _: []
//     }, log);
//     expect(config).to.not.equal(false);
//     expect(typeof config.core).to.equal('object');
//     expect(typeof config.core.dist).to.equal('string');
//     expect(typeof config.color).to.equal('object');
//     expect(typeof config.color.primary).to.equal('string');
//     done();
//   });
//   it ('logs an error and returns false when it cannot find a config' , (done) => {
//     const previousConsole = console.log;
//     let lastMessage = '';
//     console.log = (input) => {
//       lastMessage += input;
//     };
//     const config = handleConfig.loadConfig(testDirectoryName, {
//       config: 'asdf/fdsafd',
//       _: []
//     }, log);
//     expect(config).to.equal(false);
//     console.log = previousConsole;
//     expect(lastMessage).to.include('"message": "ENOENT: no such file or directory');
//     expect(lastMessage).to.include('"stack": "Error:');
//     done();
//   });
// });
