const Boom = require('@hapi/boom');

// Role checking middleware
function hasRoleInList(roles, ignoreOnFail) {
  return {
    method(request) {
      const { user } = request.auth.credentials;
      const hasGivenRole = roles.some(role => user.roles.some(r => r === role));

      if (!hasGivenRole) {
        if (ignoreOnFail) {
          return false;
        }
        throw Boom.forbidden('insufficient_rights');
      }

      return true;
    },
    assign: 'hasRights',
    failAction: ignoreOnFail ? 'ignore' : undefined,
  };
}

// Check connected user is requested user
const isConnectedUser = {
  method(request) {
    const { user } = request.auth.credentials;
    return request.params.user === user._id.toString();
  },
  assign: 'isConnectedUser',
  failAction: 'ignore',
};

function hasScopeInList(wantedScopes) {
  return {
    method(request) {
      const { scopes } = request.auth.credentials;

      if (scopes.indexOf('all') !== -1) {
        return true;
      }

      const matchedScopes = wantedScopes.reduce((acc, scope) => {
        if (scopes.find(s => s === scope)) {
          acc.push(scope);
        }

        return acc;
      }, []);

      if (!matchedScopes.length) {
        throw Boom.forbidden('out_of_scope');
      }

      return matchedScopes;
    },
    assign: 'scopes',
  };
}

module.exports = {
  hasRoleInList,
  isConnectedUser,
  hasScopeInList,
};
