const _ = require('lodash');

// Role checking middleware
function hasRoleInList(roles) {
  return {
    method(request, h) {
      const user = request.auth.credentials;
      const hasGivenRole = _.some(roles, role => _.includes(user.roles, role));

      return !hasGivenRole ? h.view('403').takeover() : h.continue;
    },
    assign: 'hasRole',
  };
}

module.exports = {
  hasRoleInList,
};
