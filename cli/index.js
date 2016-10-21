const { mongodb } = require('config');
const mongoose = require('mongoose');

const User = require('../server/users/models/user');

mongoose.Promise = global.Promise;

const userPart = mongodb.user ? `${mongodb.user}:${mongodb.password}@` : '';
mongoose.connect(`mongodb://${userPart}${mongodb.host}:${mongodb.port}/${mongodb.database}`, mongodb.config)
  .then(() => {
    const user = new User({
      firstName: 'admin',
      lastName: 'admin',
      email: 'admin@link-value.fr',
      fallbackEmail: 'admin@link-value.fr',
    });

    return user.hashPassword('admin');
  })
  .then(user => user.save())
  .then(() => {
    console.log('User admin@link-value.fr:admin was created');
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
