const Joi = require('@hapi/joi');
const Boom = require('@hapi/boom');

module.exports = {
  method: 'POST',
  path: '/forgot-password',
  config: {
    auth: false,
    validate: {
      payload: Joi.object({
        email: Joi.string().required(),
      }),
    },
  },
  async handler(req) {
    const { User } = req.server.plugins.users.models;
    const { email } = req.payload;

    const user = await User.findOne({ email });
    if (!user || user.leftAt < new Date() || user.hiredAt > new Date()) {
      throw Boom.notFound('invalid_email');
    }

    await req.server.plugins.login.resetPassword(user);

    return { ok: true };
  },
};
