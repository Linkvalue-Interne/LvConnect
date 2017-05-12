const _ = require('lodash');

// Role checking middleware
function hasRoleInList(roles) {
  return {
    method(request, reply) {
      const user = request.auth.credentials;
      const hasGivenRole = _.some(roles, role => _.includes(user.roles, role));

      return !hasGivenRole ? reply.view('403').takeover() : reply(null, true);
    },
    assign: 'hasRole',
  };
}

module.exports = {
  hasRoleInList,
};
