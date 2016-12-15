module.exports = {
  method: 'GET',
  path: '/users/me',
  handler(req, res) {
    return res.mongodb(req.auth.credentials, ['password']);
  },
};
