const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  appId: String,
  appSecret: String,
  redirectUris: [String],
  allowedScopes: [String],
  allowedGrantTypes: [String],
});

module.exports = mongoose.model('Application', applicationSchema);
