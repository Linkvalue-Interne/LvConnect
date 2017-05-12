module.exports = {
  method: 'GET',
  path: '/dashboard/change-password',
  config: { auth: 'session' },
  handler(req, res) {
    if (!req.auth.credentials.needPasswordChange) {
      return res.redirect('/dashboard');
    }

    return res.view('change-password', {
      pageTitle: 'Password change',
    });
  },
};
