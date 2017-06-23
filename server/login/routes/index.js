const getLogin = require('./get-login');
const postLogin = require('./post-login');
const getLogout = require('./get-logout');
const getAssets = require('./get-assets');
const getForgotPassword = require('./get-forgot-password');
const postForgotPassword = require('./post-forgot-password');

module.exports = [
  getLogin,
  postLogin,
  getLogout,
  getAssets,
  getForgotPassword,
  postForgotPassword,
];
