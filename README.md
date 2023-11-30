# NDLA front-end

![CI](https://github.com/NDLANO/ndla-frontend/workflows/CI/badge.svg)

The front-end code powering [https://ndla.no](https://ndla.no).

Norwegian Digital Learning Arena (NDLA) (Norwegian: Nasjonal digital læringsarena) is a joint county enterprise offering [open digital learning assets](https://en.wikipedia.org/wiki/Digital_learning_assets) for upper secondary education. In addition to being a compilation of [open educational resources (OER)](https://en.wikipedia.org/wiki/Open_educational_resources), NDLA provides a range of other online tools for sharing and cooperation.

## Requirements

- Node.JS 20
- yarn v4
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

```yarn
yarn
```

### Start development server

Start node server with hot reloading middleware listening on port 3000.

```yarn
yarn start
```

To use a different api set the `NDLA_ENVIRONMENT` environment variable.

### Unit tests

Test framework: [Jest](https://github.com/facebook/jest)

```yarn
yarn test
```

### e2e tests

[Cypress](https://www.cypress.io/) is used for end to end testing.

```yarn
yarn e2e
```

To circumvent api call flakiness all request are mocked when the tests are run on ci. Use the following command to record new mocks when api-calls change:

```yarn
yarn e2e-record-fixtures
```

To run the e2e tests with recorded/mocked api-calls run

```yarn
yarn e2e-use-fixtures
```

### Code style

[Prettier](https://prettier.io/) is used for automatic code formatting.

```yarn
yarn format
```

```yarn
yarn format-check
```

### Linting

Eslint is used for linting.

```yarn
yarn lint-es
```

Rules are configured in `./eslintrc` and extends [esling-config-ndla](https://github.com/NDLANO/frontend-packages/tree/master/packages/eslint-config-ndla).

#### Gql template linting

The [eslint-plugin-graphql](https://github.com/apollographql/eslint-plugin-graphql) is used to check the queries against the GraphQL schema.

Make sure you have an running instance of the GraphQL enpoint with your latest changes

```yarn
yarn get-gql-schema-local
```

### TypeScript

[GraphQL code generator](https://www.graphql-code-generator.com/) is used to generate TypeScript types from the local GraphQL schema and queries.

```yarn
yarn generate-gql-types
```

The configuration is found in `codegen.yml`.

## Other scripts

```yarn
# GTG? Checks code formating, linting and runs unit tests:
yarn check-all
```

```yarn
# Create minified production ready build:
yarn build
```

```yarn
# Start a production build:
yarn start-prod
```

```yarn
# Start a development server with server side rendering disabled:
yarn start-without-ssr
```

```yarn
# Start a development sever which talks to a local graphql server running on [localhost:4000]:
yarn start-with-local-graphql
```

```yarn
# Do you TDD?
yarn tdd
```

```bash
# Docker stuff
./build.sh
```
