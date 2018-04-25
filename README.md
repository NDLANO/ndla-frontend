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

All dependencies are defined in `package.json` and are managed with npm/yarn. To
initially install all dependencies and when the list dependency has changed,
run `yarn install`.

```
$ yarn install
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

### Code style

[Prettier] is used for automatic code formatting.

```
$ yarn prettier
```

### Linting

_tl;dr_: Use eslint! Rules: [Airbnb Styleguide]https://github.com/airbnb/javascript.

Lint code with [eslint](http://eslint.org/), including [eslint react plugin](https://github.com/yannickcr/eslint-plugin-react), [eslint-plugin-import](https://github.com/benmosher/eslint-plugin-import), [eslint-plugin-jsx-a11y](https://github.com/evcohen/eslint-plugin-jsx-a11y#readme).
Beside linting with globally installed eslint, eslint can be invoked with `npm`:

```
$ yarn run lint
```

Rules are configured in `./.eslintrc.js` and extends [eslint-config-airbnb](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb). If feeling brave, try `eslint --fix`.

#### Gql template linting

The [eslint-plugin-graphql](https://github.com/apollographql/eslint-plugin-graphql) is used to check the queries against the GraphQL schema.

To update the schema you need to install [apollo-codegen](https://github.com/apollographql/apollo-codegen).

```
yarn global install apollo-codegen
```

Make sure you have an running instance of the GraphQL enpoint with your latest changes

```
apollo-codegen introspect-schema http://localhost:4000/graphql --output src/gqlSchema.json
```

## Other scripts

```
# Create minified production ready build:
$ yarn run build
```

```
# Docker stuff
$ ./build.sh
```
