const mongoose = require('mongoose');
const uuid = require('uuid/v4');
const uuidHash = require('../../uuid-hash');

const applicationSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  appId: { type: String, index: true, default: uuid },
  appSecret: { type: String, index: true, default: uuidHash },
  redirectUris: [String],
  allowedScopes: [String],
  allowedGrantTypes: [String],
});

module.exports = mongoose.model('Application', applicationSchema);
