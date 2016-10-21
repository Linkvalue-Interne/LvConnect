# Endpoint: `/oauth`

This endpoint deals with OAuth authentication.

## `POST /oauth/token`

Generates authentication tokens according to `grant_type`. The following grants are allowed:
- password
- refresh_token

#### Request payload for password grant

```js
{
  "grant_type": "password",  // required
  "username": String,        // required
  "password": String,        // required
  "scope": Array<String>     // optional
}
```

#### Request payload for refresh_token grant

```js
{
  "grant_type": "refresh_token",  // required
  "refresh_token": String,        // required
  "scope": Array<String>          // optional
}
```
