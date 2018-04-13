const fs = require('fs');

exports.checkOutput = (t, file) => {
  const out = fs.readFileSync(`${__dirname}/out/${file}`, 'utf8');
  const expected = fs.readFileSync(`${__dirname}/expected/${file}`, 'utf8');
  t.equal(out, expected);
};
