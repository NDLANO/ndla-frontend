### Build stage
FROM node:22.17.1-alpine3.21 AS builder

ENV HOME=/home/app
ENV APP_PATH=$HOME/ndla-frontend
ARG COMPONENT_VERSION
ENV COMPONENT_VERSION=$COMPONENT_VERSION

# Copy necessary files for installing dependencies
COPY yarn.lock package.json .yarnrc.yml $APP_PATH/

# Enable yarn
RUN corepack enable

# Run yarn before src copy to enable better layer caching
WORKDIR $APP_PATH
RUN yarn install --immutable

# Copy necessary source files for server and client build
COPY babel.config.cjs tsconfig.json vite.config.ts panda.config.ts eslint.config.mjs postcss.config.cjs $APP_PATH/
COPY scripts $APP_PATH/scripts

COPY src $APP_PATH/src
COPY public $APP_PATH/public

# Build client code
RUN --mount=type=secret,id=sentry_token \
  export SENTRY_AUTH_TOKEN=$(cat /run/secrets/sentry_token) && \
  yarn run build

### Run stage
FROM node:22.17.1-alpine3.21

WORKDIR /home/app/ndla-frontend
COPY --from=builder /home/app/ndla-frontend/build build

ENV NODE_ENV=production
ARG COMPONENT_VERSION
ENV COMPONENT_VERSION=$COMPONENT_VERSION
ENV APPLICATION_NAME="ndla-frontend"

CMD ["node", "build/server.mjs"]
