const _ = require('lodash');

// Role checking middleware
function hasRoleInList(roles) {
  return {
    method(request, reply) {
      const user = request.auth.credentials;
      const hasGivenRole = _.some(roles, role => _.includes(user.roles.some, role));

      return (!hasGivenRole) ? reply.view('403') : reply(null, true);
    },
  };
}

module.exports = {
  hasRoleInList,
};
