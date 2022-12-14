### Build stage
FROM node:18.12-alpine as builder

ENV HOME=/home/app
ENV APP_PATH=$HOME/ndla-frontend

# Copy necessary files for installing dependencies
COPY yarn.lock package.json $APP_PATH/

# Run yarn before src copy to enable better layer caching
WORKDIR $APP_PATH
RUN yarn install

# Copy necessary source files for server and client build
COPY .babelrc tsconfig.json .eslintrc.js postcss.config.js $APP_PATH/
COPY webpack $APP_PATH/webpack
COPY scripts $APP_PATH/scripts

COPY src $APP_PATH/src
COPY public $APP_PATH/public

# Build client code
RUN yarn run build

### Run stage
FROM node:18.12-alpine

RUN apk add py-pip jq && pip install awscli
COPY run-ndla-frontend.sh /

WORKDIR /home/app/ndla-frontend
COPY --from=builder /home/app/ndla-frontend/build build

ENV NODE_ENV=production

CMD ["/run-ndla-frontend.sh", "node build/server.js '|' bunyan"]
