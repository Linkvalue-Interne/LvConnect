const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, index: true, unique: true },
  fallbackEmail: String,
  password: String,
  roles: [String],
  thirdParty: Object,
  createdAt: { type: Date, default: Date.now },
});

userSchema.methods.hashPassword = function hashPassword(password) {
  return bcrypt.hash(password, 10).then((hash) => {
    this.password = hash;
    return this;
  });
};

userSchema.methods.comparePassword = function comparePassword(password) {
  return bcrypt.compare(password, this.password);
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
