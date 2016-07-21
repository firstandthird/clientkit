'use strict';
const ghpages = require('gh-pages');
const path = require('path');

ghpages.publish(path.join(__dirname, '../examples'), {
  dotfiles: true
}, (err) => {
  if (err) {
    console.error(err);
  }
  console.log('done');
});
