const Joi = require('joi');
const uuid = require('uuid');

module.exports = {
  method: 'POST',
  path: '/login',
  config: {
    auth: false,
    validate: {
      payload: Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required(),
      }),
    },
  },
  handler(req, res) {
    const { User } = req.server.plugins.users.models;

    return User.findOneByEmailAndPassword(req.payload.email, req.payload.password)
      .then((user) => {
        const sid = uuid.v4();

        req.server.app.cache.set(sid, { user }, 0, (err) => {
          if (err) {
            throw err;
          }

          req.cookieAuth.set({ sid });
          res.redirect('/dashboard');
        });
      })
      .catch(() => {
        res.view('get-login', {
          email: req.payload.email,
          error: 'Invalid username or password.',
        });
      });
  },
};
