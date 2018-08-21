const path = require('path');
const request = require('request-promise');

module.exports = [{
  method: 'GET',
  path: '/mdl/{param*}',
  config: {
    auth: false,
  },
  handler: {
    directory: {
      path: [
        path.resolve(__dirname, '../../../node_modules/material-design-lite/dist'),
        path.resolve(__dirname, '../../../node_modules/material-design-icons/iconfont'),
      ],
    },
  },
}, {
  method: 'GET',
  path: '/{path*}',
  config: { auth: false },
  async handler(req, res) {
    if (process.env.APP_ENV === 'dev' && !path.extname(req.params.path)) {
      const html = await request({
        method: 'GET',
        uri: 'http://localhost:8080/',
      });

      return res(html.replace('{{CSRF_TOKEN}}', req.server.plugins.crumb.generate(req, res)));
    }

    if (!path.extname(req.params.path)) {
      return res.file('dist/index.html');
    }

    return res.file(path.join('dist', req.params.path));
  },
}, {
  method: 'GET',
  path: '/',
  config: {
    auth: false,
  },
  handler(req, res) {
    return res.redirect('/old/dashboard');
  },
}];
