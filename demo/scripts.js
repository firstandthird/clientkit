import { ready } from 'domassist';

ready(() => {
  const a = 'B';

  return a.toLocaleLowerCase();
});


function test() {
  return 'test';
}

export default test;
