const Joi = require('joi');
const Boom = require('boom');

module.exports = {
  method: 'POST',
  path: '/reset-password',
  config: {
    auth: { strategies: ['pkey-token', 'query-token', 'bearer'] },
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

    const { User } = req.server.plugins.users.models;
    const user = await User.findById(req.auth.credentials._id);
    if (!user) {
      throw Boom.notFound();
    }
    if (oldPassword) {
      const isSamePassword = await user.comparePassword(oldPassword);
      if (!isSamePassword) {
        throw Boom.forbidden('Invalid password');
      }
    }
    await user.hashPassword(newPassword);
    await user.save();
    if (cleanupSessions) {
      await req.server.plugins.oauth.cleanupUserTokens(user._id);
      await req.server.plugins.login.cleanupUserSessions(user._id.toString());
    }
    return res.mongodb(user);
  },
};
