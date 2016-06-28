module.exports = function () {
  return function () {
    return {
      '&::after': {
        content: '""',
        display: 'table',
        clear: 'both'
      }
    }
  };
};
