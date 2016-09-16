# Endpoint: /users

This endpoint deals with users.

## `GET /users`

Retrieve the whole collection of users.

### Response example

```json
[
  {
    "firstName": "Jacky",
    "lastName": "Michelle",
    "email": "jacky.michelle@link-value.fr",
    "password": "youporn",
    "id": "57dab587c4b5df5e7c696c76",
    "createdAt": "2016-09-15T14:51:51.551Z"
  },
  {
    "id": "57dab0934e0b3d4beed41363",
    "email": "pjacky.michelle@link-value.fr",
    "firstName": "JackPy",
    "lastName": "Michelple",
    "password": "pornhub",
    "createdAt": null
  },
  {
    "id": "57dab0c84e0b3d4beed41364",
    "email": "pjacky.michelle@link-value.fr",
    "firstName": "JackPy",
    "lastName": "Michelple",
    "password": "pornhub",
    "createdAt": null
  }
]
```

## `POST /users`

Creates a new user.

### Payload

```json
{
  "firstName": String,
  "lastName": String,
  "email": String,
  "plainPassword": String
}
```

### Response example

```json
{
  "id": "57dab0934e0b3d4beed41363",
  "email": "pjacky.michelle@link-value.fr",
  "firstName": "JackPy",
  "lastName": "Michelple",
  "password": "pornhub",
  "createdAt": null
}
```

## `GET /users/{id}`

Retrieve an user.

### Response example

```json
{
  "id": "57dab0c84e0b3d4beed41364",
  "email": "pjacky.michelle@link-value.fr",
  "firstName": "JackPy",
  "lastName": "Michelple",
  "password": "pornhub",
  "createdAt": null
}
```

## `PUT /users/{id}`

Updates an user.

### Payload

```json
{
  "firstName": String,
  "lastName": String,
  "email": String,
  "plainPassword": String
}
```

### Response example

```json
{
  "firstName": "Jacky",
  "lastName": "Michelle",
  "email": "jacky.michelle@link-value.fr",
  "password": "youporn",
  "id": "57dab587c4b5df5e7c696c76",
  "createdAt": "2016-09-15T14:51:51.551Z"
}
```

## `DELETE /users/{id}`

Deletes an user.
