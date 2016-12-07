# LvConnect

This project aims to unify login over all LinkValue apps with an authentication service based on OAuth2.

## Installation

You will need to have on your machine:
- [Redis](http://redis.io/) (>3.x)
- [MongoDB](https://www.mongodb.com/) (>3.x.x)

Then run in your cloned folder:
```
npm install
```

If you want to work on this project, run:
```
npm run dev
```

Or if you want the production mode:
```
npm run prod
```

The server listens to `localhost:5000` in dev and to `lvconnect.linkvalue.fr` for prod.

## Api reference

Bellow are listed all the endpoints available for now in the application.

#### Public endpoints
- [/oauth](docs/endpoint-oauth.md) (Authentication endpoint)

#### Protected endpoint

All the endpoints listed below are protected and requires authentication with an access token.
This token must be issued rom the oauth enpoint (see documentation above).
This token must be passed in the `Authorization` header as `Bearer`.

- [/users](docs/endpoint-users.md) (Users endpoint)
