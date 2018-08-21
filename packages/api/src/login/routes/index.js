const getLogin = require('./get-old-login');
const postOldLogin = require('./post-old-login');
const postLogin = require('./post-login');
const getLogout = require('./get-logout');
const getAssets = require('./get-assets');
const getForgotPassword = require('./get-forgot-password');
const postForgotPassword = require('./post-forgot-password');

module.exports = [
  getLogin,
  postOldLogin,
  postLogin,
  getLogout,
  getAssets,
  getForgotPassword,
  postForgotPassword,
];
