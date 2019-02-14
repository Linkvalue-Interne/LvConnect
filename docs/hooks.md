# Hooks

Hooks allow you to connect any third party app to LVConnect events. They are resolved
with a job queue system and may not be instantaneous. To register a new hook, go into
your app details page and scroll down to "Hooks" and add a new one.

The URI of your hook will be called with a POST and JSON content of the event as
payload. Also headers will contain the signature of the payload with your provided secret
via HMAC SHA1 algorithm in `X-LVConnect-Signature` (see details about payload verification
below). Each trigger will be registered within the database for debugging purpose up to
10 runs. A random identifier will be generated for each and send within
`X-LVConnect-Delivery`. Finally the `X-LVConnect-Event` will contain the event type.

Response sent back to LVConnect will also be stored up to 100Ko per run. You can
see all those details within the edit page of your hook under "Derniers déclenchements".

## Events

Your hook can register to any combination of the following events:

#### `user:created`

This event will be triggered when a user is created within the application. The payload
will contain:

```json
{
  "user": {}, // Created suer informations
  "sender": {} // User that triggered the creation
}
```

#### `user:modified`

When a user is edited via API or within the admin interface, this event will be triggered.
It will contain the following payload:

```json
{
  "user": {}, // Updated user
  "sender": {} // User that triggered the update
}
```

#### `user:deleted`

Triggered when a user is deleted. This should almost never happen since user MUST be soft deleted
but in some rare cases it could happen. Instead make sure you listen to `user:modified` and look
for the `leftAt` property to disable account.

```json
{
  "userId": {}, // Deleted user id
  "sender": {} // User that triggered the deletion
}
```

## Payload Validation

To ensure that hook trigger comes from the right origin, LVConnect signs the payload with the hook
secret using HMAC SHA1 algorithm. To perform the verification on your side, calculate the signature
of the payload you received and compare with the one in the `X-LVConnect-Signature` header. See
example integrations bellow:

### NodeJS

In NodeJS you'll no any extra library to perform the validation since HMAC SHA1 can be performed from the
`crypto` module of the NodeJS API. Example using Express:

```js
import express from 'express';
import crypto from 'crypto';

const secret = 'TopSecretHookPassword@SuperStrong#123456';
const app = express();

app.use((req, res, next) => {
  // If using body parser be sure to calculate from stringified version
  // const body = JSON.stringify(req.body);
  
  const hash = crypto.createHmac('sha1', secret).update(req.body).digest('hex');

  if (`sha1=${hash}` !== req.headers['x-lvconnect-signature']) {
    next(new Error('Invalid payload signature'));
  }

  next();
});

app.listen(3000);
```

Example using HapiJS:

```js
import crypto from 'crypto';
import Hapi from 'hapi';

const server = Hapi.server({ port: 3000, host: 'localhost' });

server.auth.scheme('signature', (_, options) => ({
  options: { payload: true },
  authenticate: async (req, h) => h.authenticated({
    credentials: { event: req.headers['x-lvconnect-event'], identifier: req.headers['x-lvconnect-delivery'] },
    artifacts: { signature: req.headers['x-lvconnect-signature'] },
  }),
  payload: async (req, h) => {
    const body = JSON.stringify(req.payload);
    const hash = crypto.createHmac('sha1', options.secret).update(body).digest('hex');

    if (`sha1=${hash}` !== req.headers['x-lvconnect-signature']) {
      throw Boom.forbidden('Invalid payload signature');
    }

    return h.continue;
  },
}));

server.auth.strategy('hook', 'signature', {
  secret: 'TopSecretHookPassword@SuperStrong#123456',
});

server.route({
  method: 'POST',
  path: '/hooks/users',
  config: {
    auth: 'hook',
  },
  async handler(req) {
    // Event type will be stored in `req.auth.credentials.event`
  },
});

server.start();
```
