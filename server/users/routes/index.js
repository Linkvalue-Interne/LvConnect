const cgetUsers = require('./cget-users');
const postUsers = require('./post-users');
const getUsers = require('./get-users');
const putUsers = require('./put-users');
const deleteUsers = require('./delete-users');

module.exports = [
  cgetUsers,
  postUsers,
  getUsers,
  putUsers,
  deleteUsers,
];
