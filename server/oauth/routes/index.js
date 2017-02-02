const getAssets = require('./get-assets');
const getAuthorize = require('./get-authorize');
const postAuthorize = require('./post-authorize');
const postToken = require('./post-token');

module.exports = [
  getAssets,
  getAuthorize,
  postAuthorize,
  postToken,
];
