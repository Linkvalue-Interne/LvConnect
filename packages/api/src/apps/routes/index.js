const getApps = require('./getApps.route');
const getApp = require('./getApp.route');
const postApp = require('./postApp.route');
const putApp = require('./putApp.route');
const deleteApp = require('./deleteApp.route');

module.exports = [
  getApps,
  getApp,
  postApp,
  putApp,
  deleteApp,
];
