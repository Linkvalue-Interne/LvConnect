const _ = require('lodash');
const Joi = require('joi');
const { payload, validRoles } = require('../../users/routes/user-validation');
const { hasRoleInList } = require('../middlewares');

module.exports = {
  method: 'POST',
  path: '/dashboard/users/create',
  config: {
    pre: [hasRoleInList(['rh', 'staff'])],
    auth: 'session',
    validate: {
      payload: payload.post.keys({
        plainPasswordCheck: Joi.string().required(),
        roles: Joi.array().items(Joi.string().valid(validRoles)).single().min(1)
          .required(),
      }),
      failAction: (req, res, src, error) => {
        req.server.log('info', error);
        res.view('create-user', {
          newUser: req.payload,
          validRoles,
        });
      },
    },
  },
  handler(req, res) {
    const { User } = req.server.plugins.users.models;

    const body = req.payload;

    const user = new User(_.pick(body, [
      'firstName',
      'lastName',
      'email',
      'fallbackEmail',
      'roles',
    ]));

    user
      .hashPassword(body.plainPassword)
      .then(() => user.save())
      .then(() => {
        res.redirect('/dashboard/users');
      })
      .catch(() => {
        res.view('create-user', {
          newUser: body,
          validRoles,
        });
      });
  },
};
