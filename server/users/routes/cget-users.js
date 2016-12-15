const Joi = require('joi');

module.exports = {
  method: 'GET',
  path: '/users',
  config: {
    validate: {
      query: Joi.object().keys({
        email: Joi.string().email(),
        limit: Joi.number().min(1).max(100),
        page: Joi.number().min(1),
      }),
    },
  },
  handler(req, res) {
    const { User } = req.server.plugins.users.models;
    const limit = req.query.limit || 20;
    const page = req.query.page - 1;
    const email = req.query.email;

    const resultPromise = User
      .find()
      .where(email ? { email: { $eq: email } } : null)
      .limit(limit)
      .skip(page * limit || 0)
      .select('-password')
      .exec();

    const countPromise = User.count();

    const usersPromise = Promise.all([resultPromise, countPromise])
      .then(([results, count]) => ({
        results,
        pageCount: Math.ceil(count / limit),
        page,
        limit,
      }));

    res.mongodb(usersPromise);
  },
};
