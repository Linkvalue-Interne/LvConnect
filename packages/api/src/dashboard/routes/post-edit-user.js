const Joi = require('joi');
const { roles } = require('@lvconnect/config/server');

const { validRoles, validCities } = require('../../users/routes/user-validation');
const { hasRoleInList } = require('../middlewares');

module.exports = {
  method: 'POST',
  path: '/dashboard/users/{user}/edit',
  config: {
    pre: [hasRoleInList([roles.BOARD, roles.HR])],
    auth: 'session',
    validate: {
      payload: Joi.object({
        firstName: Joi.string().min(2).required(),
        lastName: Joi.string().min(2).required(),
        email: Joi.string().email(),
        description: Joi.string().empty('').max(255),
        roles: Joi.array().items(Joi.string().valid(validRoles)).single().min(1)
          .required(),
        githubHandle: Joi.string().allow(''),
        trelloHandle: Joi.string().allow(''),
        city: Joi.string().allow(''),
      }),
      failAction: (req, res, src, error) => res.view('create-user', {
        pageTitle: 'Edit partner',
        userData: req.payload,
        validRoles,
        validCities,
        error,
        editMode: true,
      }),
    },
  },
  handler(req, res) {
    const { User } = req.server.plugins.users.models;
    const body = req.payload;
    const userId = req.params.user;
    const { githubOrgUserLink, trelloOrgUserLink } = req.server.plugins.tasks;

    return User
      .findOneAndUpdate({ _id: userId }, { $set: body }, { new: true })
      .exec()
      .then((savedUser) => {
        if (savedUser.githubHandle && savedUser.thirdParty.github !== 'success') {
          githubOrgUserLink({ user: savedUser });
        }
        if (savedUser.trelloHandle && savedUser.thirdParty.trello !== 'success') {
          trelloOrgUserLink({ user: savedUser });
        }
        return res.redirect(`/old/dashboard/users/${userId}`);
      });
  },
};
