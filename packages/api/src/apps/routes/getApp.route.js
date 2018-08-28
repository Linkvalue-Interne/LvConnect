const Boom = require('boom');

const { params } = require('../appValidations');
const { hasScopeInList } = require('../../middlewares');

module.exports = {
  method: 'GET',
  path: '/apps/{app}',
  config: {
    pre: [hasScopeInList('apps:get')],
    validate: {
      params,
    },
  },
  async handler(req, res) {
    const { Application } = req.server.plugins.apps.models;

    const app = await Application.findOne({ _id: req.params.app });

    if (!app) {
      return res(Boom.notFound('User Not Found'));
    }

    return res.mongodb(app);
  },
};