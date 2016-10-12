'use strict';

const glob = require('glob');
const fs = require('fs');

module.exports = function(fileName, hashedName, conf) {
  const nameArr = fileName.split('.');
  const regex = new RegExp(`(\\<\\!--\\s{0,}clientkit:${nameArr.join('\\.')}\\s{0,}--\\>)([\\t\\n\\s\\<a-zA-Z0-9\\"\\/\\.\\>\\=-]*)(\\<\\!--\\s{0,}clientkit:end\\s{0,}-->)`);
  const fileLink = `<link rel="stylesheet" href="/${conf.prefix}${hashedName}">`;
  glob(conf.file, (err, files) => {
    if (err) {
      console.log('Error finding injection files');
    }

    files.forEach((file) => {
      fs.readFile(file, (fileErr, content) => {
        let contentString = content.toString();
        contentString = contentString.replace(regex, `\$1\n${fileLink}\n\$3`);
        fs.writeFile(file, contentString, (writeErr) => {
          if (writeErr) {
            console.log(writeErr);
          }
        });
      });
    });
  });
};
