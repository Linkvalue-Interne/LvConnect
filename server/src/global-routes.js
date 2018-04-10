const path = require('path');

module.exports = [{
  method: 'GET',
  path: '/assets/{param*}',
  config: {
    auth: false,
  },
  handler: {
    directory: {
      path: [
        path.resolve(__dirname, '../../node_modules/material-design-lite/dist'),
        path.resolve(__dirname, '../../node_modules/material-design-icons/iconfont'),
      ],
    },
  },
}, {
  method: 'GET',
  path: '/',
  config: {
    auth: false,
  },
  handler(req, res) {
    return res.redirect('/dashboard');
  },
}];
