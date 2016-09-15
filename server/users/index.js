exports.register = (server, options, next) => {
  next();
};

exports.register.attributes = {
  name: 'users',
  version: '0.0.1',
};
