const Boom = require('@hapi/boom');

const { params } = require('../appValidations');
const { hasScopeInList } = require('../../middlewares');

module.exports = {
  method: 'GET',
  path: '/apps/{app}',
  config: {
    pre: [hasScopeInList(['apps:get'])],
    validate: {
      params,
    },
  },
  async handler(req, res) {
    const { Application } = req.server.plugins.apps.models;

    const app = await Application.findOne({ _id: req.params.app });

    if (!app) {
      throw Boom.notFound('App Not Found');
    }

    return res.mongodb(app);
  },
};
