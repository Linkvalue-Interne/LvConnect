const postHook = require('./postHook.route');
const getHooks = require('./getHooks.route');
const getHook = require('./getHook.route');
const putHook = require('./putHook.route');
const deleteHook = require('./deleteHook.route');

module.exports = [
  postHook,
  getHooks,
  getHook,
  putHook,
  deleteHook,
];
