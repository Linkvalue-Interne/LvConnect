const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, index: true },
  password: String,
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

module.exports = mongoose.model('User', userSchema);
