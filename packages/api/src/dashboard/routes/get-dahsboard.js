module.exports = {
  method: 'GET',
  path: '/dashboard',
  config: { auth: 'session' },
  handler(req, res) {
    res.view('get-dashboard', {
      pageTitle: 'Welcome',
    });
  },
};
