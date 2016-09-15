module.exports = {
  method: 'GET',
  path: '/users',
  handler(req, res) {
    const { User } = req.server.plugins.users.models;
    res(User.find().exec());
  },
};
