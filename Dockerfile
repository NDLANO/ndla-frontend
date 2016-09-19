FROM node:6.6.0

#Add app user to enable running the container as an unprivileged user
RUN useradd --user-group --create-home --shell /bin/false app

ENV HOME=/home/app
ENV APP_PATH=$HOME/ndla-frontend

# Copy necessary files for installing dependencies
COPY package.json .npmrc $APP_PATH/
RUN chown -R app:app $HOME/*

# Run npm install before src copy to enable better layer caching
USER app
WORKDIR $APP_PATH
RUN mkdir -p $APP_PATH/htdocs/assets/ && \
    npm install

# Copy necessary source files for server and client build
USER root
COPY .babelrc webpack.config.base.js webpack.config.dev.js webpack.config.prod.js $APP_PATH/

COPY src $APP_PATH/src
COPY style $APP_PATH/style
COPY server $APP_PATH/server
RUN chown -R app:app $HOME/*

# Build client code
USER app
WORKDIR $APP_PATH
RUN npm run build

CMD ["npm", "run", "start-prod"]
