'use strict';
const beforeEach = require('mocha').beforeEach;
const describe = require('mocha').describe;
const it = require('mocha').it;
const expect = require('chai').expect;
const path = require('path');

// global config object for each test
let conf;

const executeCss = (cssExpression, callback) => {
  const cssProcessor = require('../tasks/css.js');
  // config, base, outputName, input, callback
  cssProcessor(conf, process.cwd(), 'none', cssExpression, callback);
};

describe('spacing mixin', () => {
  beforeEach((beforeEachDone) => {
    conf = require('confi')({
      path: [
        './conf'
      ],
      context: {
        CKDIR: __dirname,
        CONFIGDIR: path.join(process.cwd(), 'clientkit')
      }
    });
    conf.consoleOnly = true;
    beforeEachDone();
  });
  it('generates basic css spacers', (done) => {
    const spacing = require('../styles/mixins/spacing.js')(conf);
    const result = spacing({}, 'margin', 'top', 'md');
    expect(result['margin-top']).to.equal('30px');
    const result2 = spacing({}, 'padding', 'bottom', 'none');
    expect(result2['padding-bottom']).to.equal(0);
    done();
  });
  it('generates multi-axis css spacers', (done) => {
    const spacing = require('../styles/mixins/spacing.js')(conf);
    // xaxis:
    const xaxisResult = spacing({}, 'margin', 'xaxis', 'lg');
    expect(xaxisResult['margin-xaxis']).to.equal('50px');
    // yaxis:
    const yaxisResult = spacing({}, 'padding', 'yaxis', 'xs');
    expect(yaxisResult['padding-yaxis']).to.equal('10px');
    // all:
    const allResult = spacing({});
    expect(allResult['.margin-xl']['margin-top']).to.equal('80px');
    expect(allResult['.margin-xl']['margin-left']).to.equal('80px');
    expect(allResult['.margin-xl']['margin-bottom']).to.equal('80px');
    expect(allResult['.margin-xl']['margin-right']).to.equal('80px');
    expect(allResult['.margin-xaxis-xs']['margin-right']).to.equal('10px');
    done();
  });
  it('can be executed as a @mixin', (done) => {
    const result = executeCss('@mixin spacing;', (result) => {
      expect(result.css).to.include('.padding-none');
      done();
    });
  });
});

describe('tabs mixin', () => {
  beforeEach((beforeEachDone) => {
    conf = require('confi')({
      path: [
        './conf'
      ],
      context: {
        CKDIR: __dirname,
        CONFIGDIR: path.join(process.cwd(), 'clientkit')
      }
    });
    beforeEachDone();
  });
  it('generates basic css tabs', (done) => {
    const tabs = require('../styles/mixins/tabs.js')(conf);
    const result = tabs({}, '3', '12');
    expect(result['border-radius']).to.equal('12');
    expect(result['& .tab']['& + label']['border-radius']).to.equal('12 12 0 0');
    expect(typeof result['& .tab:checked:nth-of-type(1) ~ .tab-content:nth-of-type(1)']).to.equal('object');
    expect(result['& .tab:checked:nth-of-type(2) ~ .tab-content:nth-of-type(2)'].position).to.equal('relative');
    expect(result['& .tab:checked:nth-of-type(2) ~ .tab-content:nth-of-type(2)'].transform).to.include('translateY');
    done();
  });
  // it('sets up the site-max', (done) => {
  //   executeCss('@mixin site-max;', (result) => {
  //     expect(result.css).to.include('max-width');
  //     expect(result.css).to.include(conf.siteMaxWidth);
  //     done();
  //   });
  // });
  it('generates css for buttons', (done) => {
    executeCss('@mixin button var(--color-button-primary-bg), var(--color-button-primary-color);', (result) => {
      console.log(result.css)
      done()
    });
  });
});
