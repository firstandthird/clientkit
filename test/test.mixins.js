// 'use strict';
// const expect = require('chai').expect;
// const path = require('path');
// const fs = require('fs');
//
// // global config object for each test
// const conf = require('confi')({
//   path: [
//     './conf'
//   ],
//   context: {
//     CKDIR: __dirname,
//     CONFIGDIR: path.join(process.cwd(), 'examples/clientkit')
//   }
// });
// conf.consoleOnly = true;
//
// // helper function to write sample json to file:
// const writeToFile = (cssJson, fileName) => {
//   fs.writeFileSync(`test/expectedOutputs/mixins/${fileName}`, `module.exports=${JSON.stringify(cssJson, null, 2)};`);
// };
// // helper function to compare to sample json from file:
// const compare = (result, fileName) => {
//   const json = require(path.join(process.cwd(), `test/expectedOutputs/mixins/${fileName}`));
//   expect(json).to.deep.equal(result);
// };
//
// describe('bg colors mixin', function() {
//   it('generates css bg colors', (done) => {
//     const colors = require('../styles/mixins/bg-colors.js')(conf);
//     const result = colors({});
//     compare(result, 'bg-colors.js');
//     done();
//   });
// });
//
// describe('bg image mixin', function() {
//   it('generates css bg image', (done) => {
//     const image = require('../styles/mixins/bg-image.js')(conf);
//     const result = image({}, 'http://nope.com/myImage.jpg');
//     compare(result, 'bg-image.js');
//     done();
//   });
// });
//
// describe('fancy-underline', function() {
//   it('renders a fancy-underline', (done) => {
//     const fancy = require('../styles/mixins/fancy-underline.js')(conf);
//     // (rule, backgroundColor, linkColor, hoverColor, offset, width, activeOffset) {
//     const result = fancy({}, '#333', '#111', '#fff', 10, 12, 15);
//     compare(result, 'fancy-underline.js');
//     done();
//   });
// });
//
// describe('grid', function() {
//   it('generates grid classes', (done) => {
//     const grid = require('../styles/mixins/grid.js')(conf);
//     const result = grid({});
//     compare(result, 'grid.js');
//     done();
//   });
// });
//
// describe('flex-grid', function() {
//   it('generates flex classes', (done) => {
//     const grid = require('../styles/mixins/flex-grid.js')(conf);
//     const result = grid({});
//     compare(result, 'flex-grid.js');
//     done();
//   });
// });
//
// describe('hide', function() {
//   it('generates hide classes', (done) => {
//     const hide = require('../styles/mixins/hide.js')(conf);
//     const result = hide({}, 'sm', 'block');
//     compare(result, 'hide-sm.js');
//     const result2 = hide({}, null, 'block');
//     compare(result2, 'hide-null.js');
//     done();
//   });
// });
//
// describe('spacing mixin', function() {
//   it('generates basic css spacers', (done) => {
//     const spacing = require('../styles/mixins/spacing.js')(conf);
//     const result = spacing({}, 'margin', 'top', 'md');
//     expect(result['margin-top']).to.equal(conf.spacing.default.md);
//     compare(result, 'spacing-md.js');
//     const result2 = spacing({}, 'padding', 'bottom', 'none');
//     compare(result2, 'spacing-none.js');
//     done();
//   });
//   it('generates multi-axis css spacers', (done) => {
//     const spacing = require('../styles/mixins/spacing.js')(conf);
//     // xaxis:
//     const xaxisResult = spacing({}, 'margin', 'xaxis', 'lg');
//     expect(xaxisResult['margin-left']).to.equal(conf.spacing.default.lg);
//     expect(xaxisResult['margin-right']).to.equal(conf.spacing.default.lg);
//     // yaxis:
//     const yaxisResult = spacing({}, 'padding', 'yaxis', 'xs');
//     expect(yaxisResult['padding-top']).to.equal(conf.spacing.default.xs);
//     expect(yaxisResult['padding-bottom']).to.equal(conf.spacing.default.xs);
//     // all:
//     const allResult = spacing({});
//     compare(allResult, 'spacing.js');
//     done();
//   });
// });
// it('generates basic css tabs', (done) => {
//   const tabs = require('../styles/mixins/tabs.js')(conf);
//   const result = tabs({}, '3', '12');
//   compare(result, 'tabs.js');
//   done();
// });
