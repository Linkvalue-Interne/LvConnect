const Boom = require('boom');
const _ = require('lodash');

module.exports = function authorize(req, res) {
  const { models: { Authorization, Application }, validScopes } = req.server.plugins.oauth;
  const { generateAuthorizationCode, generateAccessToken } = req.server.methods;
  const user = req.auth.credentials;
  const {
    redirect_uri: redirectUri,
    app_id: appId,
    client_id: clientId,
    response_type: responseType,
  } = req.query;

  return Application.findOne({ appId: clientId || appId })
    .then(application => Authorization.findOne({ user, application }).then(auth => [auth, application]))
    .then(([authorization, application]) => {
      if (!application.redirectUris.find(uri => redirectUri === uri)) {
        return Promise.reject(Boom.badRequest('Invalid redirect URI.'));
      }

      const scopes = req.payload.scopes.split(',');
      const invalidScopes = _.difference(scopes, _.intersection(validScopes, application.allowedScopes));
      if (invalidScopes.length > 0) {
        return Promise.reject(Boom.badRequest(`Invalid scopes: ${invalidScopes.join(',')}.`));
      }

      if (authorization === null) {
        return Authorization.create({
          user,
          application,
          allowedScopes: scopes,
        }).then(() => [application, scopes]);
      }

      return Authorization.findByIdAndUpdate(authorization._id, {
        $set: { allowedScopes: scopes },
      }).then(() => [application, scopes]);
    })
    .then(([application, scopes]) => {
      const state = req.query.state ? `&state=${req.query.state}` : '';
      if (responseType === 'token') {
        return generateAccessToken(user, application, scopes)
          .then(accessToken => res.redirect(`${redirectUri}?token=${accessToken.token}${state}`));
      }

      return generateAuthorizationCode(user, application, scopes)
        .then(authorizationCode => res.redirect(`${redirectUri}?code=${authorizationCode.code}${state}`));
    })
    .catch(error => res(Boom.wrap(error)));
};
