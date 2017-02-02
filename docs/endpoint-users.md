# Endpoint: `/users`

This endpoint deals with users.

## `GET /users`

Retrieve the whole collection of users. Accepts the following filter params:
- `limit`: Limit the number of results per page (default: 20).
- `page`: Select a page of results (default: 1).
- `email`: Find a user by its email (strict matching).

#### Response payload

```js
{
  "results": [{
    "id": String,
    "firstName": String,
    "lastName": String,
    "email": String,
    "fallbackEmail": String,
    "description": String,
    "pictureProfileUrl": String,
    "createdAt": Date,
    "roles": [String]
  }],
  "page": Number,      // Requested page.
  "limit": Number,     // Requested limit of results per page.
  "pageCount": Number  // Amount of pages regarding the results per page.
}
```

## `POST /users`

Creates a new user. Requires to specify at least one valid role in: tech, hr, staff, business and board.
Also requires to have either hr or staff in logged user roles to perform request.

#### Request payload

```js
{
  "firstName": String,          // required
  "lastName": String,           // required
  "email": String,              // required
  "fallbackEmail": String,
  "description": String,
  "plainPassword": String       // required
  "roles": [String]             // required
}
```

#### Response payload

```js
{
  "id": String,
  "firstName": String,
  "lastName": String,
  "email": String,
  "fallbackEmail": String,
  "description": String,
  "pictureProfileUrl": String,
  "createdAt": Date,
  "roles": [String]
}
```

## `GET /users/{id}`

Retrieve an user.

#### Response payload

```js
{
  "id": String,
  "firstName": String,
  "lastName": String,
  "email": String,
  "fallbackEmail": String,
  "description": String,
  "pictureProfileUrl": String,
  "createdAt": Date,
  "roles": [String]
}
```

## `PUT /users/{id}`

Updates an user. Connected user can edit himself.
To edit user roles, connected user requires either hr or staff in his roles.

#### Request payload

```js
{
  "firstName": String,
  "lastName": String,
  "email": String,
  "fallbackEmail": String,
  "description": String,
  "roles": [String]         // requires hr/staff role
}
```

## `DELETE /users/{id}`

Deletes an user.
To delete a user, connected user requires either hr or staff in his roles.

#### Request payload

```js
{
  "deleted": Boolean,
}
```

## `GET /users/me`

Retrieve the user corresponding to given access token.

#### Response payload

```js
{
  "id": String,
  "firstName": String,
  "lastName": String,
  "email": String,
  "fallbackEmail": String,
  "description": String,
  "pictureProfileUrl": String,
  "createdAt": Date,
  "roles": [String]
}
```
