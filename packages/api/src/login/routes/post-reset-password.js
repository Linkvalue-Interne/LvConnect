const Joi = require('@hapi/joi');
const Boom = require('@hapi/boom');

module.exports = {
  method: 'POST',
  path: '/reset-password',
  config: {
    auth: { strategies: ['bearer', 'pkey-token'] },
    validate: {
      payload: Joi.object().keys({
        oldPassword: Joi.string().max(255),
        newPassword: Joi.string().min(5).max(30).required(),
        cleanupSessions: Joi.boolean(),
      }),
    },
  },
  async handler(req, res) {
    const { oldPassword, newPassword, cleanupSessions } = req.payload;

    if (req.auth.strategy === 'bearer' && !oldPassword) {
      throw Boom.badRequest('missing_old_password');
    }

    const { User } = req.server.plugins.users.models;
    const user = await User.findById(req.auth.credentials.user._id).select('+password');
    if (!user) {
      throw Boom.notFound();
    }
    if (oldPassword) {
      const isSamePassword = await user.comparePassword(oldPassword);
      if (!isSamePassword) {
        throw Boom.forbidden('invalid_password');
      }
    }
    if (user.needPasswordChange) {
      const isSamePassword = await user.comparePassword(newPassword);
      if (isSamePassword) {
        throw Boom.badRequest('same_password');
      }
    }
    await user.hashPassword(newPassword);
    user.needPasswordChange = false;
    await user.save();
    if (cleanupSessions) {
      await req.server.plugins.oauth.cleanupUserTokens(user._id);
    }
    if (req.auth.strategy === 'pkey-token') {
      await req.server.plugins.login.cleanPasswordResetToken(req.auth.artifacts.pkey);
    }
    return res.mongodb(user);
  },
};
