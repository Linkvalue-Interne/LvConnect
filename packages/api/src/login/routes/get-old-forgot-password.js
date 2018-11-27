module.exports = {
  method: 'GET',
  path: '/old/forgot-password',
  config: { auth: false },
  handler(req, res) {
    return res.view('get-forgot-password', {
      title: 'Forgot password',
    });
  },
};
