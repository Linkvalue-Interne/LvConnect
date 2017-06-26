module.exports = {
  method: 'GET',
  path: '/oauth/sso-button',
  config: {
    auth: {
      strategies: ['session'],
      mode: 'optional',
    },
    plugins: {
      'hapi-auth-cookie': { redirectTo: false },
    },
  },
  handler(req, res) {
    const context = req.auth.isAuthenticated ? req.auth.credentials.toJSON() : {};
    return res.view('oauth-login-button', context, { layout: false })
      .header('X-Frame-Options', 'ALLOWALL');
  },
};
