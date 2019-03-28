const { fork } = require('child_process');
const path = require('path');

const run = () => {
  const child = fork(path.resolve(__dirname, 'webpack.js'), [process.argv[2] || '']);

  child.on('message', message => {
    child.kill();
    run();
  });
};

run();
