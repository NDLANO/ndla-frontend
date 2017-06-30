FROM node:8.1.2-alpine

ENV HOME=/home/app
ENV APP_PATH=$HOME/ndla-frontend

# Copy necessary files for installing dependencies
COPY yarn.lock package.json $APP_PATH/

# Run yarn before src copy to enable better layer caching
WORKDIR $APP_PATH
RUN mkdir -p $APP_PATH/htdocs/assets/ && \
    yarn

# Copy necessary source files for server and client build
COPY .babelrc webpack.config.base.js webpack.config.dev.js webpack.config.prod.js postcss.config.js $APP_PATH/

COPY src $APP_PATH/src
COPY style $APP_PATH/style
COPY server $APP_PATH/server

# Build client code
WORKDIR $APP_PATH
RUN yarn run build
CMD ["npm", "run", "start-prod"]
