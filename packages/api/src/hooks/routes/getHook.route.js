const Boom = require('boom');

const { params } = require('../hookValidations');
const { hasScopeInList } = require('../../middlewares');

module.exports = {
  method: 'GET',
  path: '/hooks/{hook}',
  config: {
    pre: [hasScopeInList('hooks:get')],
    validate: {
      params,
    },
  },
  async handler(req, res) {
    const { Hook } = req.server.plugins.hooks.models;

    const hook = await Hook.findOne({ _id: req.params.hook });

    if (!hook) {
      throw Boom.notFound('Hook Not Found');
    }

    return res.mongodb(hook);
  },
};
