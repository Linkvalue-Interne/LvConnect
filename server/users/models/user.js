const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, index: true },
  fallbackEmail: String,
  password: String,
  thirdParty: Object,
  createdAt: { type: Date, default: Date.now },
});

userSchema.methods.hashPassword = function hashPassword(password) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        return reject(err);
      }
      this.password = hash;
      return resolve(this);
    });
  });
};

userSchema.methods.comparePassword = function comparePassword(password) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password, (err, res) => {
      if (err) {
        return reject(err);
      }
      return resolve(res);
    });
  });
};

userSchema.statics.findOneByEmailAndPassword = function findOneByEmailAndPassword(email, password) {
  return this.findOne({ email })
    .then((user) => {
      if (user === null) throw Error('user_not_found');
      return user.comparePassword(password)
        .then((validPassword) => {
          if (!validPassword) throw Error('invalid_password');

          return user;
        });
    });
};

module.exports = mongoose.model('User', userSchema);
