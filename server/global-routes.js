const path = require('path');

module.exports = [{
  method: 'GET',
  path: '/mdl/{param*}',
  config: {
    auth: false,
  },
  handler: {
    directory: {
      path: [
        path.resolve(__dirname, '../node_modules/material-design-lite/dist'),
        path.resolve(__dirname, '../node_modules/material-design-icons/iconfont'),
      ],
    },
  },
}];
