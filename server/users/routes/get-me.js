module.exports = {
  method: 'GET',
  path: '/users/me',
  handler(req, res) {
    const { User } = req.server.plugins.users.models;

    const userPromise = User
      .findById(req.auth.credentials._id)
      .select('-password')
      .exec();

    return res.mongodb(userPromise);
  },
};
