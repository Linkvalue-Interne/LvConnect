module.exports = {
  method: 'GET',
  path: '/dashboard/change-password',
  config: { auth: 'session' },
  handler(req, res) {
    res.view('change-password', {
      pageTitle: 'Password change',
    });
  },
};
