/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import express from 'express';
import helmet from 'helmet';
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

app.use(
  helmet({
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
    },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'", 'blob:'],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          " 'unsafe-eval'",
          'https://*.ndla.no',
          'https://players.brightcove.net',
          'http://players.brightcove.net',
          'https://players.brightcove.net',
          'https://www.nrk.no',
          'https://www.googletagmanager.com',
          'https://www.google-analytics.com',
          'https://www.youtube.com',
          'https://s.ytimg.com',
          'https://cdn.auth0.com',
          'https://vjs.zencdn.net',
          'https://httpsak-a.akamaihd.net',
          '*.brightcove.com',
          '*.brightcove.net',
          'bcove.me',
          'bcove.video',
          '*.api.brightcove.com',
          '*.o.brightcove.com',
          'players.brightcove.net',
          'hls.ak.o.brightcove.com',
          'uds.ak.o.brightcove.com',
          'brightcove.vo.llnwd.net',
          '*.llnw.net',
          '*.llnwd.net',
          '*.edgefcs.net',
          '*.akafms.net',
          '*.edgesuite.net',
          '*.akamaihd.net',
          '*.analytics.edgekey.net',
          '*.deploy.static.akamaitechnologies.com',
          '*.cloudfront.net',
          'hlstoken-a.akamaihd.net',
          'vjs.zencdn.net',
          ' *.gallerysites.net',
        ],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "'unsafe-eval'",
          'https://fonts.googleapis.com',
          'https://fonts.gstatic.com',
        ],
        fontSrc: [
          "'self'",
          'https://fonts.googleapis.com',
          'https://fonts.gstatic.com',
          'data:',
        ],
        imgSrc: [
          "'self'",
          'https://*.ndla.no',
          'https://www.google-analytics.com',
          'https://stats.g.doubleclick.net',
          'http://metrics.brightcove.com',
          'https://httpsak-a.akamaihd.net',
          ' data:',
        ],
        connectSrc: [
          " 'self' ",
          'https://*.ndla.no',
          'https://logs-01.loggly.com',
          'https://edge.api.brightcove.com',
          'https://secure.brightcove.com',
          'https://bcsecure01-a.akamaihd.net',
          'https://hlsak-a.akamaihd.net',
        ],
      },
    },
    frameguard: process.env.NODE_ENV === 'development'
      ? {
          action: 'allow-from',
          domain: '*://localhost',
        }
      : undefined,
  }),
);

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
