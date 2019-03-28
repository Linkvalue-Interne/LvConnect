const postHook = require('./postHook.route');
const getHooks = require('./getHooks.route');
const getHook = require('./getHook.route');
const putHook = require('./putHook.route');
const deleteHook = require('./deleteHook.route');
const postHookTest = require('./postHookTest.route');

const routes = [
  postHook,
  getHooks,
  getHook,
  putHook,
  deleteHook,
];

module.exports = process.env.APP_ENV === 'test' ? routes.concat([postHookTest]) : routes;
