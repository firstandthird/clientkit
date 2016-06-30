'use strict';

class Partridge {
  goHere(string) {
    return `${string} here`;
  }
  goThere(string) {
    return `${string} there`;
  }
}


const test = new Partridge();
test.goHere('place');
