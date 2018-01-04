const tap = require('tap');
const utils = require('./utils');

tap.test('Full', t => {
  utils.checkOutput(t, 'full.css');
  t.end();
});

tap.test('Slim', t => {
  utils.checkOutput(t, 'slim.css');
  t.end();
});
