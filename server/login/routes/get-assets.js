const path = require('path');

module.exports = {
  method: 'GET',
  path: '/login/assets/{param*}',
  config: { auth: false },
  handler: {
    directory: {
      path: path.resolve(__dirname, '../assets'),
    },
  },
};
