const Joi = require('joi');
const uuid = require('uuid');

module.exports = {
  method: 'GET',
  path: '/logout',
  config: {
    auth: false,
  },
  handler(req, res) {
    req.cookieAuth.clear();
    return res.redirect('/login');
  },
};
