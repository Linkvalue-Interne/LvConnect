const Boom = require('boom');
const Joi = require('joi');
const path = require('path');
const fs = require('fs');
const request = require('request-promise');
const config = require('@lvconnect/config/server');

const oauthFilePath = path.resolve(process.cwd(), 'dist/oauth.html');

module.exports = {
  method: 'GET',
  path: '/oauth/authorize',
  config: {
    auth: false,
    validate: {
      query: Joi.object().keys({
        app_id: Joi.string(),
        client_id: Joi.string(),
        redirect_uri: Joi.string().required(),
        response_type: Joi.string().valid(['code', 'token']),
        state: Joi.string().max(255),
        scope: Joi.string(),
      }),
    },
  },
  async handler(req, res) {
    if (!req.query.app_id && !req.query.client_id) {
      throw Boom.badRequest('You must specify either app_id or client_id query param.');
    }

    let html;
    if (config.proxyWebpackDevServer) {
      html = await request({
        method: 'GET',
        uri: 'http://localhost:8080/oauth.html',
      });
    } else {
      html = await new Promise((resolve, reject) => fs.readFile(oauthFilePath, (err, buffer) => {
        if (err) {
          reject(err);
        } else {
          resolve(buffer.toString());
        }
      }));
    }

    return html.replace('{{CSRF_TOKEN}}', req.server.plugins.crumb.generate(req, res));
  },
};
