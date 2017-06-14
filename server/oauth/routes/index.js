const getAssets = require('./get-assets');
const getAuthorize = require('./get-authorize');
const postAuthorize = require('./post-authorize');
const postToken = require('./post-token');
const getLoginButton = require('./get-login-button');

module.exports = [
  getAssets,
  getAuthorize,
  postAuthorize,
  postToken,
  getLoginButton,
];
