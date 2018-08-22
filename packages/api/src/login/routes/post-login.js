const Boom = require('boom');
const Joi = require('joi');
const { oauth: { scopes: validScopes, privateScopes } } = require('@lvconnect/config');

const fullScopes = validScopes.concat(privateScopes);

module.exports = {
  method: 'POST',
  path: '/login',
  config: {
    auth: false,
    plugins: {
      crumb: {
        restful: true,
      },
    },
    validate: {
      payload: Joi.object({
        grantType: Joi.string().valid(['password', 'refresh']).required(),
        username: Joi.any().when('grantType', {
          is: 'password',
          then: Joi.string().required(),
          else: Joi.any().forbidden(),
        }),
        password: Joi.any().when('grantType', {
          is: 'password',
          then: Joi.string().required(),
          else: Joi.any().forbidden(),
        }),
        refreshToken: Joi.alternatives().when('grantType', { is: 'refresh', then: Joi.string().required() }),
      }),
    },
  },
  async handler(req, res) {
    const { refreshToken, username, password } = req.payload;

    let userId;
    let needPasswordChange = false;
    if (refreshToken) {
      const { RefreshToken } = req.server.plugins.oauth.models;
      const token = await RefreshToken.findOne({
        token: refreshToken,
        expireAt: { $gt: Date.now() },
      });

      if (!token) {
        return res(Boom.unauthorized('invalid_token'));
      }

      userId = token.user;
    } else {
      const { User } = req.server.plugins.users.models;
      try {
        const user = await User.findOneByEmailAndPassword(username, password);
        if (user.leftAt < new Date()) {
          return res(Boom.unauthorized('user_disabled'));
        }
        userId = user._id;
        ({ needPasswordChange } = user);
      } catch (e) {
        return res(Boom.unauthorized('invalid_user'));
      }
    }

    const { generateAccessToken, generateRefreshToken } = req.server.methods;
    const { accessTokenTTL } = req.server.plugins.oauth;

    const [accessToken, newRefreshToken] = await Promise.all([
      generateAccessToken(userId, null, fullScopes),
      generateRefreshToken(userId, null, fullScopes),
    ]);

    return res({
      accessToken: accessToken.token,
      expiresIn: accessTokenTTL,
      refreshToken: newRefreshToken.token,
      needPasswordChange,
    });
  },
};
