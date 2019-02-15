const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { formatNumber, parseNumber } = require('libphonenumber-js');

const formatPhoneNumber = phone => formatNumber(parseNumber(phone, 'FR'), 'International');

const toUpperCase = value => value.toUpperCase();

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: { type: String, get: toUpperCase, set: toUpperCase },
  email: { type: String, index: true, unique: true },
  tags: [String],
  phone: { type: String, set: formatPhoneNumber },
  job: String,
  password: { type: String, select: false },
  roles: [String],
  githubHandle: String,
  trelloHandle: String,
  thirdParty: {
    github: { type: String, default: 'stopped' },
    trello: { type: String, default: 'stopped' },
    slack: { type: String, default: 'stopped' },
  },
  createdAt: { type: Date, default: Date.now },
  hiredAt: Date,
  leftAt: Date,
  birthDate: Date,
  registrationNumber: String,
  description: String,
  city: String,
  needPasswordChange: { type: Boolean, default: true },
  address: {
    street: String,
    zipCode: String,
    city: String,
  },
});

userSchema.virtual('profilePictureUrl').get(function getProfilePictureUrl() {
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
  return this.findOne({ email }).select('+password')
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
