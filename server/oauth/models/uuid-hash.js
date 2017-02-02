const uuid = require('uuid/v4');
const crypto = require('crypto');

module.exports = function uuidHash() {
  const shaSum = crypto.createHash('sha1');
  shaSum.update(uuid.v4());
  return shaSum.digest('hex');
};
