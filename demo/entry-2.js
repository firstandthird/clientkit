import Domodule from 'domodule';

class Foo extends Domodule {
  postInit() {
    this.bar = 'baz';
  }
}

Domodule.register('Foo', Foo);
