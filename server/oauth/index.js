exports.register = (server, options, next) => {
  next();
};

exports.register.attributes = {
  name: 'oauth',
  version: '0.0.1',
}
