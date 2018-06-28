# NDLA Front-End

[![Build Status](https://travis-ci.org/NDLANO/ndla-frontend.svg?branch=master)](https://travis-ci.org/NDLANO/ndla-frontend)

## Requirements

* Node.JS ~8.10
* npm ~3.9
* yarn ~1.6
* Docker (optional)

## Getting started

What's in the box?

* React
* Redux
* GraphQL
* Express
* Webpack + Babel (ES6) via Razzle

### Dependencies

All dependencies are defined in `package.json` and are managed with yarn. To
initially install all dependencies and when the list dependency has changed,
run `yarn`.

```
$ yarn
```

### Start development server

Start node server with hot reloading middleware listening on port 3000.

```
$ yarn start
```

To use a different api set the `NDLA_ENVIRONMENT` environment variable.

### Unit tests

Test framework: Jest with enzyme.

```
$ yarn test
```

### e2e tests

[Cypress](https://www.cypress.io/) is used for end to end testing.

```
$ yarn e2e
```

To circumvent api call flakiness all request are mocked when the tests are run on ci. Use the following command to record new mocks when api-calls change:

```
$ yarn e2e-record-fixtures
```

To run the e2e tests with recorded/mocked api-calls run

```
$ yarn e2e-use-fixtures
```

### Code style

[Prettier](https://prettier.io/) is used for automatic code formatting.

```
$ yarn prettier
```

### Linting

Eslint is used for linting.

```
$ yarn run lint
```

Rules are configured in `./eslintrc` and extends [esling-config-ndla](https://github.com/NDLANO/frontend-packages/tree/master/packages/eslint-config-ndla).

#### Gql template linting

The [eslint-plugin-graphql](https://github.com/apollographql/eslint-plugin-graphql) is used to check the queries against the GraphQL schema.

To update the schema you need to install [apollo-codegen](https://github.com/apollographql/apollo-codegen).

```
yarn global add apollo-codegen
```

Make sure you have an running instance of the GraphQL enpoint with your latest changes

```
apollo-codegen introspect-schema http://localhost:4000/graphql-api/graphql --output src/gqlSchema.json
```

## Other scripts

```
# Create minified production ready build:
$ yarn build
```

```
# Start a production build:
$ yarn start-prod
```

```
# Start a development server with server side rendering disabled:
$ yarn start-without-ssr
```

```
# Start a development sever which talks to a local graphql server running on [localhost:4000]:
$ yarn start-with-local-graphql
```

```
# Docker stuff
$ ./build.sh
```
