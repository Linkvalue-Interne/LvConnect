module.exports = {
  method: 'GET',
  path: '/login',
  config: {
    auth: {
      mode: 'optional',
      strategies: ['session'],
    },
  },
  handler(req, res) {
    if (!req.auth.isAuthenticated) {
      return res.view('get-login', {
        title: 'Login',
      });
    }

    return res.redirect('/dashboard');
  },
};
