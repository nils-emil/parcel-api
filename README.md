<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456

[circleci-url]: https://circleci.com/gh/nestjs/nest

## Description

Small project built with [Nest](https://github.com/nestjs/nest) framework.

## Missing features & possible improvements

* Database setup via .env file
    - Database configuration should come from .env file
* Dockerfile
    - Would be good to have a dockerfile that builds the production container image.
    - Would be good if that dockerfile did not run as root
    - Would be good if that end container would have all files as read-only
* Test setup improvement
    - Setup database via test-containers or similar so that DB wouldn't have to manually
* Race condition
    - The SKU uniqueness is checked, but during the check and the insert, another request could try insert the same SKU.
      This is solved by using a unique constraint in the database, but could lead to a technical error instead a
      validation error that is shown to the user.
* jest.spyOn
    - spyOn should have an optional third parameters, but seems to like the typing is not correct. So ts-ignore was
      used.
* Letter case
    - The SKU value is case sensitive, but it probably should be case insensitive.
    - The country searcg is case sensitive, but it should be case insensitive.

## Existing features & design choices

* Health check endpoint at /health that returns 200 OK.
    - Can be used for used for k8s liveness and readiness probes.
    - Can be used for monitoring tools to check if the application is up and running.
* Project structure - it's packaged by feature and inside that by layer
    - The application layer represents the controllers and handles mapping the user request to a business logic.
    - The domain layer represents the business logic that is not related to the external world. Ideally it should not
      know about the database or the http layer. Thus the DB models are mapped to the domain models.
    - The infrastructure - layer represents the database and the database migrations(everything related to the external
      world).

## Development setup

### Install dependencies

```bash
$ npm install
```

### Setup database via docker-compose

```bash
$ docker-compose up -d
```

### Run database migrations

```bash
$ npm run migration:up
```

### Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```


