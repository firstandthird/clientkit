'use strict';
const x = 5;
const y = 7;

class myClass {
  constructor(x, y) {
    this.value = x * y;
  }
}

const c = new myClass(x, y);
module.exports = c;
