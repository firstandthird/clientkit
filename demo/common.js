import test from './scripts';
import a from './common-a';
import Domodule from 'domodule';

class Button extends Domodule {
  postInit() {
    this.a = 'b';
  }
}

Domodule.register('Button', Button);

console.log(a(test()));// eslint-disable-line no-console
