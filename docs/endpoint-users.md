# Endpoint: `/users`

This endpoint deals with users.

## `GET /users`

Retrieve the whole collection of users.

#### Response payload

```js
[
  {
    "id": String,
    "firstName": String,
    "lastName": String,
    "email": String,
    "fallbackEmail": String,
    "createdAt": Date,
    "roles": [String]
  }
]
```

## `POST /users`

Creates a new user. Requires to specify at least one valid role in: tech, hr, staff, business and board.
Also requires to have either hr or staff in logged user roles to perform request.

#### Request payload

```js
{
  "firstName": String,      // required
  "lastName": String,       // required
  "email": String,          // required
  "fallbackEmail": String,   
  "plainPassword": String   // required
  "roles": [String]         // required
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
  "createdAt": Date,
  "roles": [String]
}
```
