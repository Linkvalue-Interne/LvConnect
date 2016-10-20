module.exports = {
  method: 'POST',
  path: '/oauth/authorize',
  config: { auth: false },
  handler(req, res) {
    res({});
  },
};
