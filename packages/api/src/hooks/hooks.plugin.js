const request = require('request-promise');
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
        server.log(['worker', 'info'], `Triggering hooks for ${event.name} with ${JSON.stringify(event.data)}`);

        const hooks = await models.Hook.find({ listeningTo: { $in: [event.name] }, active: true });

        await Promise.all(hooks.map(async (hook) => {
          const hash = crypto.createHmac('sha1', 'hook.secret').update(hook.secret).digest('hex');
          const identifier = uuid();
          const headers = {
            'X-LVConnect-Signature': `sha1=${hash}`,
            'X-LVConnect-Event': event.name,
            'X-LVConnect-Delivery': identifier,
          };
          const body = event.data;
          const dateStart = new Date();

          let res;
          try {
            res = await request({ body, headers, uri: hook.uri, json: true, resolveWithFullResponse: true });
          } catch (e) {
            res = e.response;
          }

          const { failure, success } = config.hooks.statuses;
          hook.runs.unshift({
            identifier,
            status: !res || res.statusCode >= 300 ? failure : success,
            dateStart,
            dateEnd: new Date(),
            request: {
              body: JSON.stringify(body),
              headers: JSON.stringify({
                ...headers,
                'Request URL': hook.uri,
                'Request method': 'POST',
                'Content-Type': 'application/json',
              }),
            },
            response: res && {
              statusCode: res.statusCode,
              headers: JSON.stringify(res.headers),
              body: typeof res.body === 'string' ? res.body : JSON.stringify(res.body),
            },
          });
          hook.runs.splice(10);

          await hook.save();
        }));
      },
    });
  },
};
