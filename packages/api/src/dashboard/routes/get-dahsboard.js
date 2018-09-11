module.exports = {
  method: 'GET',
  path: '/dashboard',
  config: { auth: 'session' },
  async handler(req, res) {
    return res.view('get-dashboard', {
      pageTitle: 'Welcome',
    });
  },
};
