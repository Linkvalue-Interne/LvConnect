const cgetUsers = require('./cget-users');
const postUsers = require('./post-users');
const getUsers = require('./get-users');
const putUsers = require('./put-users');
const deleteUsers = require('./delete-users');
const getMe = require('./get-me');

module.exports = [
  getMe,
  cgetUsers,
  postUsers,
  getUsers,
  putUsers,
  deleteUsers,
];
