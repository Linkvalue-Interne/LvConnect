const Boom = require('boom');
const Joi = require('joi');

module.exports = {
  method: 'POST',
  path: '/login',
  config: {
    auth: false,
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
        return Boom.unauthorized('invalid_token');
      }

      userId = token.user;
    } else {
      const { User } = req.server.plugins.users.models;
      try {
        const user = await User.findOneByEmailAndPassword(username, password);
        userId = user._id;
        ({ needPasswordChange } = user);
      } catch (e) {
        return res(Boom.unauthorized('invalid_user'));
      }
    }

    const { generateAccessToken, generateRefreshToken } = req.server.methods;
    const { accessTokenTTL, validScopes } = req.server.plugins.oauth;

    const [accessToken, newRefreshToken] = await Promise.all([
      generateAccessToken(userId, null, validScopes),
      generateRefreshToken(userId, null, validScopes),
    ]);

    return res({
      accessToken: accessToken.token,
      expiresIn: accessTokenTTL,
      refreshToken: newRefreshToken.token,
      needPasswordChange,
    });
  },
};
