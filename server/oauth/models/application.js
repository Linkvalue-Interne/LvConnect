const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  appId: { type: String, index: true },
  appSecret: { type: String, index: true },
  redirectUris: [String],
  allowedScopes: [String],
  allowedGrantTypes: [String],
});

module.exports = mongoose.model('Application', applicationSchema);
