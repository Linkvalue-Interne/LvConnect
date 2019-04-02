const Joi = require('joi');
const Boom = require('boom');
const fetch = require('node-fetch');

const generateHTML = content => `
  <!DOCTYPE html>
  <html lang="en">
    <body>
    <div>${content}</div>
    </body>
  </html>
`;

module.exports = {
  method: 'GET',
  path: '/testing/oauth/callback/{appId}/{param*}',
  config: {
    auth: false,
    validate: {
      query: {
        code: Joi.string(),
        error: Joi.string(),
        state: Joi.string(),
      },
    },
  },
  async handler(req) {
    const { code, error, state } = req.query;
    const { appId } = req.params;
    const { isRedirectUriAllowedForApplication } = req.server.methods;
    const { Application } = req.server.plugins.apps.models;

    if (error) {
      return generateHTML('<span data-test-id="oauthCallbackError">Permissions denied</span>');
    }

    if (!error && !code) {
      return Boom.badRequest('missing_code');
    }

    const application = await Application.findOne({ appId });
    if (!application) {
      return Boom.notFound();
    }

    if (!isRedirectUriAllowedForApplication(`http://localhost:8000${req.path}`, application)) {
      return Boom.notFound();
    }

    let data;
    let authContent = 'Pending...';
    try {
      const response = await fetch('http://localhost:8000/oauth/token', {
        method: 'POST',
        headers: {
          authorization: `Basic ${Buffer.from(`${application.appId}:${application.appSecret}`).toString('base64')}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify({ code, grant_type: 'authorization_code' }),
      });
      if (response.status >= 400) {
        throw new Error();
      }
      data = await response.json();
      authContent = 'Successfully got tokens from authorization code.';
    } catch (e) {
      authContent = 'Failed to retrieve tokens from authorization code.';
    }

    let refreshContent = 'Pending...';
    try {
      const response = await fetch('http://localhost:8000/oauth/token', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          refresh_token: data.refresh_token,
          grant_type: 'refresh_token',
          client_id: application.appId,
          client_secret: application.appSecret,
        }),
      });
      if (response.status >= 400) {
        throw new Error();
      }
      data = await response.json();
      refreshContent = 'Successfully got tokens from refresh token.';
    } catch (e) {
      refreshContent = 'Failed to retrieve tokens from refresh token.';
    }

    let meContent = 'Pending...';
    try {
      const response = await fetch('http://localhost:8000/users/me', {
        method: 'GET',
        headers: {
          authorization: `Bearer ${data.access_token}`,
          'content-type': 'application/json',
        },
      });
      if (response.status >= 400) {
        throw new Error();
      }
      data = await response.json();
      meContent = `Current user is ${data.firstName} ${data.lastName}`;
    } catch (e) {
      meContent = 'Failed to retrieve current user.';
    }

    const stateContent = state ? `State is: ${state}` : 'No state given';

    return generateHTML(`
      <p>Welcome to <span data-test-id="oauthCallbackAppName">${application.name}</span></p>
      <ul>
        <li data-test-id="oauthCallbackAuthentication">${authContent}</li>
        <li data-test-id="oauthCallbackRefresh">${refreshContent}</li>
        <li data-test-id="oauthCallbackProfile">${meContent}</li>
        <li data-test-id="oauthCallbackState">${stateContent}</li>
      </ul>
    `);
  },
};
