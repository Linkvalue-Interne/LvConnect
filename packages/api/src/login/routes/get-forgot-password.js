module.exports = {
  method: 'GET',
  path: '/forgot-password',
  config: { auth: false },
  handler(req, res) {
    return res.view('get-forgot-password', {
      title: 'Forgot password',
    });
  },
};
