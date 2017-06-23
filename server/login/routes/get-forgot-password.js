module.exports = {
  method: 'GET',
  path: '/forgot-password',
  config: { auth: false },
  handler(req, res) {
    res.view('get-forgot-password', {
      title: 'Forgot password',
    });
  },
};
