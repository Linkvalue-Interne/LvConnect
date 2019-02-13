const Joi = require('joi');
const { hasScopeInList } = require('../../middlewares');

module.exports = {
  method: 'GET',
  path: '/hooks',
  config: {
    pre: [hasScopeInList('hooks:get')],
    validate: {
      query: Joi.object().keys({
        appId: Joi.string().required(),
      }),
    },
  },
  async handler(req, res) {
    const { Hook } = req.server.plugins.hooks.models;
    const { appId } = req.query;

    const hooks = await Hook.find({ appId });

    return res.mongodb({ results: hooks });
  },
};
