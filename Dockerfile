### Build stage
FROM node:10-alpine as builder

ENV HOME=/home/app
ENV APP_PATH=$HOME/ndla-frontend

RUN npm i -g @zeit/ncc

# Copy necessary files for installing dependencies
COPY yarn.lock package.json $APP_PATH/

# Run yarn before src copy to enable better layer caching
WORKDIR $APP_PATH
RUN yarn --production

# Copy necessary source files for server and client build
COPY .babelrc razzle.config.js postcss.config.js $APP_PATH/

COPY src $APP_PATH/src
COPY public $APP_PATH/public

# Build client code
ENV NODE_ENV=production
RUN yarn run build

### Run stage
FROM node:10-alpine

RUN npm install pm2 -g
WORKDIR /home/app/ndla-frontend
COPY --from=builder /home/app/ndla-frontend/build build

CMD ["pm2-runtime", "-i", "max", "build/server.js", "|", "bunyan"]
