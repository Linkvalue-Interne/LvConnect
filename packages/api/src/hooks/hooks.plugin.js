const fetch = require('node-fetch');
const crypto = require('crypto');
const uuid = require('uuid/v4');
const config = require('@lvconnect/config');

const routes = require('./routes');
const models = require('./models');

module.exports = {
  name: 'hooks',
  dependencies: ['mongodb', 'tasks', 'apps'],
  async register(server) {
    server.expose({
      models,
      trigger: (name, data) => {
        server.plugins.tasks.execHook({ event: { name, data } });
      },
    });

    server.route(routes);

    server.plugins.tasks.registerWorker({
      name: 'execHook',
      initWorker: () => async ({ data: { event } }) => {
        const body = JSON.stringify(event.data);
        server.log(['worker', 'info'], `Triggering hooks for ${event.name} with ${body}`);

        const hooks = await models.Hook.find({ listeningTo: { $in: [event.name] }, active: true });

        await Promise.all(hooks.map(async (hook) => {
          const hash = crypto.createHmac('sha1', hook.secret).update(body).digest('hex');
          const identifier = uuid();
          const headers = {
            'X-LVConnect-Signature': `sha1=${hash}`,
            'X-LVConnect-Event': event.name,
            'X-LVConnect-Delivery': identifier,
            'Content-Type': 'application/json',
          };
          const dateStart = new Date();

          let res = null;
          try {
            res = await fetch(hook.uri, {
              method: 'POST',
              body,
              headers,
            });
          } catch (e) {
            res = null;
          }

          const { failure, success } = config.hooks.statuses;
          hook.runs.unshift({
            identifier,
            status: !res || res.status >= 400 ? failure : success,
            dateStart,
            dateEnd: new Date(),
            request: {
              body,
              headers: JSON.stringify({
                ...headers,
                'Request URL': hook.uri,
                'Request method': 'POST',
              }),
            },
            response: res && {
              statusCode: res.status,
              headers: JSON.stringify(
                Array.from(res.headers.entries()).reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {}),
              ),
              body: await res.text(),
            },
          });
          hook.runs.splice(10);

          await hook.save();
        }));
      },
    });
  },
};
