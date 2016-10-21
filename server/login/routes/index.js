const getLogin = require('./get-login');
const postLogin = require('./post-login');
const getLogout = require('./get-logout');
const getAssets = require('./get-assets');

module.exports = [
  getLogin,
  postLogin,
  getLogout,
  getAssets,
];
