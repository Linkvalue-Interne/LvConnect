const { hasScopeInList } = require('../middlewares');

module.exports = {
  method: 'GET',
  path: '/users/me',
  config: {
    pre: [hasScopeInList('profile:get')],
  },
  handler(req, res) {
    return res.mongodb(req.auth.credentials.user, ['password', 'thirdParty', 'needPasswordChange']);
  },
};
