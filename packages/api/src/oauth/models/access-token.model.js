const mongoose = require('mongoose');
const uuid = require('uuid');

const accessTokenSchema = new mongoose.Schema({
  token: { type: String, default: uuid.v4, index: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isClientCredentialsToken: Boolean,
  expireAt: Date,
  application: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', index: true },
  scopes: [String],
});

module.exports = mongoose.model('AccessToken', accessTokenSchema);
