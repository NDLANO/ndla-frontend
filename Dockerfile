FROM node:10-alpine

ENV HOME=/home/app
ENV APP_PATH=$HOME/ndla-frontend

RUN npm install pm2 -g

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
WORKDIR $APP_PATH
RUN yarn run build

CMD ["pm2-runtime", "-i", "max", "build/server.js", "|", "bunyan"]
