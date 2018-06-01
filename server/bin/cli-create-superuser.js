/* eslint-disable no-console */

const { mongodb } = require('config');
const mongoose = require('mongoose');
const roles = require('../src/roles');

mongoose.Promise = global.Promise;

const User = require('../src/users/models/user.model');

module.exports = () => {
  const userPart = mongodb.username ? `${mongodb.username}:${mongodb.password}@` : '';
  mongoose.connect(`mongodb://${userPart}${mongodb.host}:${mongodb.port}/${mongodb.database}`, mongodb.config)
    .then(() => {
      const user = new User({
        firstName: 'admin',
        lastName: 'admin',
        email: 'admin@link-value.fr',
        fallbackEmail: 'admin@link-value.fr',
        roles: Object.values(roles),
      });

      return user.hashPassword('admin');
    })
    .then(user => user.save())
    .then(() => {
      console.log('User admin@link-value.fr:admin was created');
      process.exit(0);
    })
    .catch((err) => {
      if (err.code === 11000) {
        console.error('Admin user is already created');
      } else {
        console.error(err);
      }
      process.exit(1);
    });
};
