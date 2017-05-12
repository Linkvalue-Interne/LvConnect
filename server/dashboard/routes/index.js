const getDashboard = require('./get-dahsboard');
const getUsers = require('./get-users');
const getUser = require('./get-user');
const getCreateUser = require('./get-create-user');
const postCreateUser = require('./post-create-user');
const getEditUser = require('./get-edit-user');
const postEditUser = require('./post-edit-user');
const deleteUser = require('./delete-user');
const getAssets = require('./get-assets');
const getApplications = require('./get-apps');
const getCreateApplication = require('./get-create-app');
const getEditApplication = require('./get-edit-app');
const postCreateApplication = require('./post-create-app');
const postEditApplication = require('./post-edit-app');
const deleteApplication = require('./delete-app');

module.exports = [
  getDashboard,
  getUsers,
  getUser,
  getCreateUser,
  postCreateUser,
  getEditUser,
  postEditUser,
  deleteUser,
  getAssets,
  getApplications,
  getCreateApplication,
  getEditApplication,
  postCreateApplication,
  postEditApplication,
  deleteApplication,
];
