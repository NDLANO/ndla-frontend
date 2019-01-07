# NDLA front-end

[![Build Status](https://travis-ci.org/NDLANO/ndla-frontend.svg?branch=master)](https://travis-ci.org/NDLANO/ndla-frontend)

The front-end code powering [https://ndla.no](https://ndla.no).

Norwegian Digital Learning Arena (NDLA) (Norwegian: Nasjonal digital læringsarena) is a joint county enterprise offering [open digital learning assets](https://en.wikipedia.org/wiki/Digital_learning_assets) for upper secondary education. In addition to being a compilation of [open educational resources (OER)](https://en.wikipedia.org/wiki/Open_educational_resources), NDLA provides a range of other online tools for sharing and cooperation.

## Requirements

- Node.JS ~10
- yarn ~1.12
- Docker (optional)

## Getting started

What's in the box?

- React
- GraphQL
- Express
- Webpack + Babel (ES6) via Razzle

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

Test framework: [Jest](https://github.com/facebook/jest)

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
$ yarn format
```

```
$ yarn format-check
```

### Linting

Eslint is used for linting.

```
$ yarn lint-es
```

Rules are configured in `./eslintrc` and extends [esling-config-ndla](https://github.com/NDLANO/frontend-packages/tree/master/packages/eslint-config-ndla).

#### Gql template linting

The [eslint-plugin-graphql](https://github.com/apollographql/eslint-plugin-graphql) is used to check the queries against the GraphQL schema.

To update the schema you need to install [apollo-codegen](https://github.com/apollographql/apollo-codegen).

```
yarn global add apollo
```

Make sure you have an running instance of the GraphQL enpoint with your latest changes

```
apollo schema:download --endpoint=http://localhost:4000/graphql-api/graphql src/gqlSchema.json
```

## Other scripts

```
# GTG? Checks code formating, linting and runs unit tests:
$ yarn check-all
```

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
# Do you TDD?
$ yarn tdd
```

```
# Docker stuff
$ ./build.sh
```
