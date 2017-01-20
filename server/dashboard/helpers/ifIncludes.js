const _ = require('lodash');

module.exports = (collection, value, options) => {
  if (_.includes(collection, value)) return options.fn(this);
  return options.inverse(this);
};
