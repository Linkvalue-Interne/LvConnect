const mongoose = require('mongoose');
const uuidHash = require('./uuid-hash');

const authorizationCodeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  expireAt: Date,
  application: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', index: true },
  code: { type: String, index: true, default: uuidHash },
});

module.exports = mongoose.model('AuthorizationCode', authorizationCodeSchema);
