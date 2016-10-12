'use strict';

const Logr = require('logr');
const glob = require('glob');
const fs = require('fs');
const debounce = require('lodash.debounce');

const log = new Logr({
  type: 'cli',
  renderOptions: {
    cli: {
      lineColor: 'yellow'
    }
  }
});

const cache = {};

const writeFile = debounce((file, contentString) => {
  fs.writeFileSync(file, contentString);
}, 1000);

module.exports = function(fileName, hashedName, type, conf) {
  const nameArr = fileName.split('.');
  const regex = new RegExp(`(\\<\\!--\\s{0,}clientkit:${nameArr.join('\\.')}\\s{0,}--\\>)([\\t\\n\\s\\<a-zA-Z0-9\\"\\/\\.\\>\\=-]*)(\\<\\!--\\s{0,}clientkit:end\\s{0,}-->)`);
  let fileLink = '';
  switch (type) {
    case 'style':
      fileLink = `<link rel="stylesheet" href="/${conf.prefix}${hashedName}">`;
      break;
    case 'script':
      fileLink = `<script src="/${conf.prefix}${hashedName}"></script>`;
      break;
    default:
  }

  glob(conf.files, (err, files) => {
    if (err) {
      log('Error finding injection files');
      return;
    }

    files.forEach((file) => {
      let contentString = cache[file];
      if (!cache[file]) {
        contentString = fs.readFileSync(file).toString();
      }

      contentString = contentString.replace(regex, `\$1\n${fileLink}\n\$3`);

      cache[file] = contentString;

      writeFile(file, contentString);
    });
  });
};
