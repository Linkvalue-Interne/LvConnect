const Boom = require('boom');

// Role checking middleware
function hasRoleInList(roles, ignoreOnFail) {
  return {
    method(request, reply) {
      const { user } = request.auth.credentials;
      const hasGivenRole = roles.some(role => user.roles.some(r => r === role));

      if (!hasGivenRole) {
        return reply(ignoreOnFail ? null : Boom.forbidden('insufficient_rights'), false);
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
    const { user } = request.auth.credentials;
    const isSelf = request.params.user === user._id.toString();

    if (!isSelf) {
      return reply(null, false);
    }

    return reply(null, true);
  },
  assign: 'isConnectedUser',
  failAction: 'ignore',
};

function hasScopeInList(...wantedScopes) {
  return {
    method(request, reply) {
      const { scopes } = request.auth.credentials;

      if (scopes.indexOf('all') !== -1) {
        return reply(null, true);
      }

      const matchedScopes = wantedScopes.reduce((acc, scope) => {
        if (scopes.find(s => s === scope)) {
          acc.push(scope);
        }

        return acc;
      }, []);

      if (!matchedScopes.length) {
        return reply(Boom.forbidden('out_of_scope'));
      }

      return reply(null, matchedScopes);
    },
    assign: 'scopes',
  };
}

module.exports = {
  hasRoleInList,
  isConnectedUser,
  hasScopeInList,
};
