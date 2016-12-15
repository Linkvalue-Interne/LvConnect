const Boom = require('boom');

const rightsError = Boom.forbidden('insufficient_rights');

// Role checking middleware
function hasRoleInList(...roles) {
  return {
    method(request, reply) {
      const hasGivenRole = roles.some(role => request.auth.credentials.roles.some(r => r === role));
      return reply(hasGivenRole ? undefined : rightsError);
    },
    assign: 'hasRights',
  };
}

// Check connected user is requested user
const isConnectedUser = {
  method(request, reply) {
    const isSelf = request.params.user === request.auth.credentials._id.toString();
    return reply(isSelf || rightsError);
  },
  assign: 'isConnectedUser',
  failAction: 'ignore',
};

module.exports = {
  rightsError,
  hasRoleInList,
  isConnectedUser,
};
