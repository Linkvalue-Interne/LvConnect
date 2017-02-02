const Joi = require('joi');
const { validRoles } = require('../../users/routes/user-validation');
const { hasRoleInList } = require('../middlewares');

module.exports = {
  method: 'POST',
  path: '/dashboard/users/{user}/edit',
  config: {
    pre: [hasRoleInList(['rh', 'staff'])],
    auth: 'session',
    validate: {
      payload: Joi.object({
        firstName: Joi.string().min(2).required(),
        lastName: Joi.string().min(2).required(),
        fallbackEmail: Joi.string().email().required(),
        description: Joi.string().max(255),
        roles: Joi.array().items(Joi.string().valid(validRoles)).single().min(1)
          .required(),
      }),
      failAction: (req, res, src, error) => {
        res.view('edit-user', {
          userData: req.payload,
          validRoles,
          error,
        });
      },
    },
  },
  handler(req, res) {
    const { User } = req.server.plugins.users.models;
    const body = req.payload;
    const userId = req.params.user;

    User
      .update({ _id: userId }, { $set: body })
      .exec()
      .then(() => res.redirect(`/dashboard/users/${userId}`))
      .catch(res);
  },
};
