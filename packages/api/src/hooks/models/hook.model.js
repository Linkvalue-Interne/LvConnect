const mongoose = require('mongoose');

const HookRun = {
  identifier: { type: String },
  dateStart: { type: Date },
  dateEnd: { type: Date },
  status: { type: String },
  request: {
    headers: { type: String },
    body: { type: String },
  },
  response: {
    statusCode: { type: Number },
    headers: { type: String },
    body: { type: String },
  },
};

const hookSchema = new mongoose.Schema({
  name: { type: String, required: true },
  appId: { type: mongoose.Schema.Types.ObjectId, ref: 'App', required: true },
  listeningTo: [String],
  uri: { type: String, required: true },
  secret: { type: String, required: true },
  active: { type: Boolean, default: true },
  runs: [HookRun],
});

module.exports = mongoose.model('Hook', hookSchema);
