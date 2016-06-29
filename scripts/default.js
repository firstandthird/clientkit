'use strict';

class Partridge {
  goHere(string) {
    return `${string} here`;
  }
}


const test = new Partridge();
test.goHere('place');
