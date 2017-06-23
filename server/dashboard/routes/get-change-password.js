module.exports = {
  method: 'GET',
  path: '/dashboard/change-password',
  config: { auth: { strategies: ['pkey-token', 'query-token', 'session'] } },
  handler(req, res) {
    return res.view('change-password', {
      pageTitle: 'Password change',
      forced: req.query.forced,
    });
  },
};
