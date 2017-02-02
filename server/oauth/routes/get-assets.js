const path = require('path');

module.exports = {
  method: 'GET',
  path: '/oauth/assets/{param*}',
  config: { auth: false },
  handler: {
    directory: {
      path: path.resolve(__dirname, '../assets'),
    },
  },
};
