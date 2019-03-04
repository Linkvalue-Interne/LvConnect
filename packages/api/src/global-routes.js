const path = require('path');
const fs = require('fs');
const request = require('request-promise');

const indexFilePath = path.resolve(process.cwd(), 'dist/index.html');

module.exports = [{
  method: 'GET',
  path: '/{path*}',
  config: { auth: false },
  async handler(req, res) {
    if (!path.extname(req.params.path)) {
      let html;
      if (process.env.APP_ENV === 'dev') {
        html = await request({
          method: 'GET',
          uri: 'http://localhost:8080/',
        });
      } else {
        html = await new Promise((resolve, reject) => fs.readFile(indexFilePath, (err, buffer) => {
          if (err) {
            reject(err);
          } else {
            resolve(buffer.toString());
          }
        }));
      }

      return html.replace('{{CSRF_TOKEN}}', req.server.plugins.crumb.generate(req, res));
    }

    return res.file(path.join('dist', req.params.path));
  },
}];
