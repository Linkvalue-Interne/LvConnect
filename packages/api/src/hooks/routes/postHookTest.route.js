const crypto = require('crypto');
const Boom = require('@hapi/boom');

const checkSignature = (secret, payload, actualHash) => {
  const hash = crypto
    .createHmac('sha1', secret)
    .update(JSON.stringify(payload))
    .digest('hex');
  return hash === actualHash;
};

module.exports = {
  method: 'POST',
  path: '/testing/hooks/{id}',
  config: {
    auth: false,
  },
  async handler(req) {
    if (req.headers['x-lvconnect-event'] !== 'user:modified') {
      return Boom.badRequest('invalid_event');
    }

    const hooks = await req.server.plugins.hooks.models.Hook.findOne({ _id: req.params.id });

    if (!checkSignature(hooks.secret, req.payload, req.headers['x-lvconnect-signature'].slice(5))) {
      throw Boom.forbidden('invalid_signature');
    }

    return { status: 'Ok' };
  },
};
