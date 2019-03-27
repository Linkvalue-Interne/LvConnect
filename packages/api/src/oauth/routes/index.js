const getAuthorize = require('./get-authorize');
const postAuthorize = require('./post-authorize');
const postToken = require('./post-token');
const getPermissions = require('./get-permissions');
const getTestAuthCallback = require('./get-test-auth-callback');

const routes = [
  getAuthorize,
  postAuthorize,
  postToken,
  getPermissions,
];

module.exports = process.env.APP_ENV === 'test' ? routes.concat([getTestAuthCallback]) : routes;
