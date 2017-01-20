const _ = require('lodash');

module.exports = (roles, options) => {
  const hasRole = _.some(options.data.root.user.roles, role => _.includes(roles, role));
  return (hasRole) ? options.fn(this) : options.inverse(this);
};
