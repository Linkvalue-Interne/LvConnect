# Endpoint: `/oauth`

This endpoint deals with OAuth authentication.

## `POST /oauth/token`

Generates authentication tokens according to `grant_type`. The following grants are allowed:
- password
- refresh_token
- client_credentials

This endpoint requires client authentication (to be sure that the application is authorized to request tokens).
You must provide client credentials (client id and client secret) in the `Authorization` header as `Basic` credentials.

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

#### Request payload for client_credentials grant

This grant type allows only the read.

```js
{
  "grant_type": "client_credentials"  // required
}
```

#### Error codes

- `unsupported_grant_type`: the request grant type is not in the supported list.
- `invalid_client`: the provided client id and secret don't match any application.
- `invalid_grant`: user credentials, refresh token or authorization code is invalid.
- `invalid_scope`: The requested scope is not consistent with the scope allowed by the application, refresh token or authorization code.
