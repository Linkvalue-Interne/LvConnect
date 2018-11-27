const getLogin = require('./get-old-login');
const postOldLogin = require('./post-old-login');
const postLogin = require('./post-login');
const getLogout = require('./get-logout');
const getAssets = require('./get-assets');
const getOldForgotPassword = require('./get-old-forgot-password');
const postOldForgotPassword = require('./post-old-forgot-password');
const postForgotPassword = require('./post-forgot-password');
const postResetPassword = require('./post-reset-password');

module.exports = [
  getLogin,
  postOldLogin,
  postLogin,
  getLogout,
  getAssets,
  getOldForgotPassword,
  postOldForgotPassword,
  postForgotPassword,
  postResetPassword,
];
