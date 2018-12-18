const fs = require('fs');

exports.checkOutput = (t, hash, file) => {
  const out = fs.readFileSync(`${__dirname}/out/${hash}`, 'utf8');
  const expected = fs.readFileSync(`${__dirname}/expected/${file}`, 'utf8');
  t.equal(out, expected);
};
