# Hooks

Hooks allow you to connect any third party app to LVConnect events. They are resolved
with a job queue system and may not be instantaneous. To register a new hook, go into
your app details page and scroll down to "Hooks" and add a new one.

The URI of your hook will be called with a POST and JSON content of the event as
payload. Also headers will contain the signature of the payload with your provided
via HMAC SHA1 algorithm in `X-LVConnect-Signature`. Each trigger will be registered
within the database for debugging purpose up to 10 runs. A random identifier will be
generated for each and send within `X-LVConnect-Delivery`. Finally the
`X-LVConnect-Event` will contain the event type.

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
