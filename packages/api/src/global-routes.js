const path = require('path');
const fs = require('fs');
const fetch = require('node-fetch');
const config = require('@lvconnect/config/server');

const indexFilePath = path.resolve(process.cwd(), 'dist/index.html');

module.exports = [{
  method: 'GET',
  path: '/{path*}',
  config: { auth: false },
  async handler(req, res) {
    if (!path.extname(req.params.path)) {
      let html;
      if (config.proxyWebpackDevServer) {
        const response = await fetch('http://localhost:8080/');
        html = await response.text();
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
