const postLogin = require('./post-login');
const postForgotPassword = require('./post-forgot-password');
const postResetPassword = require('./post-reset-password');

module.exports = [
  postLogin,
  postForgotPassword,
  postResetPassword,
];
