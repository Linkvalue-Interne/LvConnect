const getAuthorize = require('./get-authorize');
const postAuthorize = require('./post-authorize');
const postToken = require('./post-token');
const getPermissions = require('./get-permissions');

module.exports = [
  getAuthorize,
  postAuthorize,
  postToken,
  getPermissions,
];
