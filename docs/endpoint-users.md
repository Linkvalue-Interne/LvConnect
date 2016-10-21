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
    "createdAt": Date
  }
]
```

## `POST /users`

Creates a new user.

#### Request payload

```js
{
  "firstName": String,      // required
  "lastName": String,       // required
  "email": String,          // required
  "fallbackEmail": String,   
  "plainPassword": String   // required
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
  "createdAt": Date
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
  "createdAt": Date
}
```

## `PUT /users/{id}`

Updates an user.

#### Request payload

```js
{
  "firstName": String,
  "lastName": String,
  "email": String,
  "fallbackEmail": String
}
```

## `DELETE /users/{id}`

Deletes an user.
