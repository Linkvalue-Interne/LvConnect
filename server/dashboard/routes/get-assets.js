const path = require('path');

module.exports = {
  method: 'GET',
  path: '/dashboard/assets/{param*}',
  config: {
    auth: 'session',
    plugins: { 'hapi-auth-cookie': { redirectTo: false } },
  },
  handler: {
    directory: {
      path: path.resolve(__dirname, '../assets'),
    },
  },
};
