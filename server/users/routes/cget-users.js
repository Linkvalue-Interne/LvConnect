module.exports = {
  method: 'GET',
  path: '/users',
  handler(req, res) {
    const { User } = req.server.plugins.users.models;

    const userPromise = User
      .find()
      .select('-password')
      .exec();

    res.mongodb(userPromise);
  },
};
