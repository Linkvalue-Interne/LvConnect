const mongoose = require('mongoose');

const accessTokenSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  expireAt: Date,
  application: { type: mongoose.Schema.Types.ObjectId, ref: 'Application' },
  scopes: [String],
});

module.exports = mongoose.model('AccessToken', accessTokenSchema);
