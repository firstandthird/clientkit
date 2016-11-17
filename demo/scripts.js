class Test {
  constructor(name) {
    //intentional to trigger eslint
    this.name = name
  }

  getName() {
    return this.name;
  }
}

new Test();
