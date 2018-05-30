const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const toUpperCase = value => value.toUpperCase();
const userSchema = new mongoose.Schema({
  firstName: String,
  email: { type: String, index: true, unique: true },
  lastName: { type: String, get: toUpperCase, set: toUpperCase },
  password: String,
  roles: [String],
  githubHandle: String,
  trelloHandle: String,
  thirdParty: {
    github: { type: String, default: 'stopped' },
    trello: { type: String, default: 'stopped' },
    slack: { type: String, default: 'stopped' },
  },
  createdAt: { type: Date, default: Date.now },
  description: String,
  city: String,
  needPasswordChange: { type: Boolean, default: true },
});

userSchema.virtual('profilePictureUrl').get(function getProfilePictureUrl(value) {
  if (value) {
    return value;
  }

  const emailHash = crypto.createHash('md5').update(this.email || '').digest('hex');
  return `https://www.gravatar.com/avatar/${emailHash}?s=200`;
});

userSchema.set('toJSON', { getters: true });

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
