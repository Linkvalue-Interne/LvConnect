const Boom = require('boom');

const rightsError = Boom.forbidden('insufficient_rights');

// Role checking middleware
function hasRoleInList(roles, ignoreOnFail) {
  return {
    method(request, reply) {
      const hasGivenRole = roles.some(role => request.auth.credentials.roles.some(r => r === role));

      if (!hasGivenRole) {
        return reply(rightsError, false);
      }

      return reply(null, true);
    },
    assign: 'hasRights',
    failAction: ignoreOnFail ? 'ignore' : undefined,
  };
}

// Check connected user is requested user
const isConnectedUser = {
  method(request, reply) {
    const isSelf = request.params.user === request.auth.credentials._id.toString();

    if (!isSelf) {
      return reply(rightsError, false);
    }

    return reply(null, true);
  },
  assign: 'isConnectedUser',
  failAction: 'ignore',
};

module.exports = {
  rightsError,
  hasRoleInList,
  isConnectedUser,
};
