const _ = require('lodash');
const Joi = require('joi');
const { validRoles, validCities } = require('../../users/routes/user-validation');
const { hasRoleInList } = require('../middlewares');

module.exports = {
  method: 'POST',
  path: '/dashboard/users/create',
  config: {
    pre: [hasRoleInList(['rh', 'board'])],
    auth: 'session',
    validate: {
      payload: Joi.object().keys({
        firstName: Joi.string().min(2).required(),
        lastName: Joi.string().min(2).required(),
        plainPassword: Joi.string().min(6).required(),
        email: Joi.string().email().required(),
        description: Joi.string().max(255).allow(''),
        roles: Joi.array().items(Joi.string().valid(validRoles)).min(1).single()
          .required(),
        githubHandle: Joi.string().allow(''),
        trelloHandle: Joi.string().allow(''),
        city: Joi.string().valid(validCities).required(),
        plainPasswordCheck: Joi.string().required(),
      }),
      failAction: (req, res, src, error) => {
        res.view('create-user', {
          pageTitle: 'Add new partner',
          userData: req.payload,
          validRoles,
          error,
        });
      },
    },
  },
  handler(req, res) {
    const { User } = req.server.plugins.users.models;
    const { githubOrgUserLink, trelloOrgUserLink } = req.server.plugins.tasks;

    const body = req.payload;

    const user = new User(_.omit(body, [
      'plainPassword',
    ]));

    user
      .hashPassword(body.plainPassword)
      .then(() => user.save())
      .then((savedUser) => {
        if (savedUser.githubHandle) {
          githubOrgUserLink({ user: savedUser });
        }
        if (savedUser.trelloHandle) {
          trelloOrgUserLink({ user: savedUser });
        }
        res.redirect('/dashboard/users');
      })
      .catch((error) => {
        res.view('create-user', {
          pageTitle: 'Add new partner',
          userData: body,
          validRoles,
          error,
        });
      });
  },
};
