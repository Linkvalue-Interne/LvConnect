/* eslint-disable no-console */

const { mongodb = {}, roles } = require('@lvconnect/config/server');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const User = require('../src/users/models/user.model');

module.exports = async () => {
  try {
    await mongoose.connect(mongodb.url, { useNewUrlParser: true });
  } catch (e) {
    console.log('Failed to connect to mongodb database');
    process.exit(1);
  }

  const user = new User({
    firstName: 'admin',
    lastName: 'admin',
    email: 'admin@link-value.fr',
    fallbackEmail: 'admin@link-value.fr',
    roles: Object.values(roles),
  });

  await user.hashPassword('admin');

  try {
    await user.save();
  } catch (err) {
    if (err.code === 11000) {
      console.error('Admin user is already created');
    } else {
      console.error(err);
    }
    process.exit(1);
  }

  console.log('User admin@link-value.fr:admin was created');
  process.exit(0);
};
