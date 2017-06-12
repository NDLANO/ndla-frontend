/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import express from 'express';
import compression from 'compression';

import enableDevMiddleWare from './helpers/enableDevMiddleware';
import { getToken } from './helpers/auth';
import { defaultRoute } from './routes/defaultRoute';
import { oembedArticleRoute } from './routes/oembedArticleRoute';
import { iframeArticleRoute } from './routes/iframeArticleRoute';

const app = express();

if (process.env.NODE_ENV === 'development') {
  enableDevMiddleWare(app);
}

app.use(compression());
app.use(
  express.static('htdocs', {
    maxAge: 1000 * 60 * 60 * 24 * 365, // One year
  }),
);
app.use((req, res, next) => {
  res.setHeader(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains',
  );
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.ndla.no https://players.brightcove.net https://www.nrk.no https://www.googletagmanager.com https://www.google-analytics.com https://www.youtube.com https://s.ytimg.com https://cdn.auth0.com; style-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com https://fonts.gstatic.com; font-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com; connect-src 'self' https://*.ndla.no https://logs-01.loggly.com; img-src 'self' https://*.ndla.no https://www.google-analytics.com https://stats.g.doubleclick.net data: ;",
  );
  next();
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 200, text: 'Health check ok' });
});

app.get('/article-iframe/:lang/:id', (req, res) => {
  getToken()
    .then(token => {
      iframeArticleRoute(req, res, token);
    })
    .catch(err => res.status(500).send(err.message));
});

app.get('/oembed', (req, res) => {
  getToken()
    .then(token => {
      oembedArticleRoute(req, res, token);
    })
    .catch(err => res.status(500).send(err.message));
});

app.get('/get_token', (req, res) => {
  getToken()
    .then(token => {
      res.send(token);
    })
    .catch(err => res.status(500).send(err.message));
});

app.get('*', (req, res) => {
  getToken()
    .then(token => {
      defaultRoute(req, res, token);
    })
    .catch(() => {
      res.status(500).send('Internal server error');
    });
});

module.exports = app;
