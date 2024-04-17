### Build stage
FROM node:20.12.1-alpine3.18 as builder

ENV HOME=/home/app
ENV APP_PATH=$HOME/ndla-frontend

# Copy necessary files for installing dependencies
COPY yarn.lock package.json .yarnrc.yml $APP_PATH/

# Enable yarn
RUN corepack enable

# Run yarn before src copy to enable better layer caching
WORKDIR $APP_PATH
RUN yarn install --immutable

# Copy necessary source files for server and client build
COPY babel.config.cjs tsconfig.json vite.config.ts .eslintrc.cjs postcss.config.cjs $APP_PATH/
COPY iframe-article.html iframe-embed.html index.html lti.html error.html $APP_PATH/
COPY scripts $APP_PATH/scripts

COPY src $APP_PATH/src
COPY public $APP_PATH/public

# Build client code
RUN yarn run build

### Run stage
FROM node:20.12.1-alpine3.18

RUN apk add py-pip jq && pip install awscli
COPY run-ndla-frontend.sh /

WORKDIR /home/app/ndla-frontend
COPY --from=builder /home/app/ndla-frontend/build build

ENV NODE_ENV=production

CMD ["/run-ndla-frontend.sh", "node build/server.mjs"]
