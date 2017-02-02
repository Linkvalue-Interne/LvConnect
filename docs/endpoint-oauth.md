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

## `GET /oauth/authorize`

Application authorization endpoint for untrusted clients (clients incapable of keeping their clientSecret).
This endpoint is **NOT** a REST endpoint, it returns HTML, not JSON. It is supposed to be called in
 a new window.
 
 This route has 3 steps:
 - **Login**: If the user is not already logged to the platform, login view is displayed. User will be redirected to
 second step when submitting a valid login.
- **Authorize**: If the user is logged in or just logged in, the authorization screen will be displayed. This page will
show to the user which permissions should be granted to use the application. If some permissions where already
granted, they will be shown too as a reminder.
- **Redirect**: Upon authorization grant, the user will be redirected to the given redirect URI with an authorization
code. If the user rejected to grant permissions, user will be redirected with an error query param.

The query params must contain a valid application id and a valid redirection URI that is in the allowed redirect
URIs of the app.

#### Request query params

```js
{
  "app_id": String,          // required
  "redirect_uri": String     // required
}
```

## `POST /oauth/authorize`

:warning: **DO NOT USE THIS ENDPOINT** :warning:

This is an internal endpoint that is used by the views of the `GET /oauth/authorize` endpoint. CSRF token generation
will forbid you to use it on your own.
