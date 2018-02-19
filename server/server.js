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
import { OK, INTERNAL_SERVER_ERROR, MOVED_PERMANENTLY } from 'http-status';

import enableDevMiddleWare from './helpers/enableDevMiddleware';
import { getToken } from './helpers/auth';
import { defaultRoute } from './routes/defaultRoute';
import { oembedArticleRoute } from './routes/oembedArticleRoute';
import { iframeArticleRoute } from './routes/iframeArticleRoute';
import { storeAccessToken } from '../src/util/apiHelpers';

const log = require('../src/util/logger');

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

const connectSrc = (() => {
  const defaultConnectSrc = [
    " 'self' ",
    'https://*.ndla.no',
    'https://logs-01.loggly.com',
    'https://edge.api.brightcove.com',
    'https://*.brightcove.com',
    'https://bcsecure01-a.akamaihd.net',
    'https://hlsak-a.akamaihd.net',
  ];
  if (process.env.LOCAL_ARTICLE_CONVERTER) {
    return [...defaultConnectSrc, 'http://localhost:3100'];
  }
  return defaultConnectSrc;
})();

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
          'https://*.ndlah5p.com',
          'https://h5p.org',
          'https://*.ndla.no',
          'https://players.brightcove.net',
          'http://players.brightcove.net',
          'https://players.brightcove.net',
          '*.nrk.no',
          'http://nrk.no',
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
          'ndla.no',
          '*.ndla.no',
          'cdnjs.cloudflare.com',
        ],
        frameSrc: [
          '*.nrk.no',
          'nrk.no',
          'https://www.youtube.com',
          'ndla.no',
          'https://*.ndlah5p.com',
          'https://h5p.org',
          '*.ndla.no',
          '*.slideshare.net',
          'slideshare.net',
          '*.vimeo.com',
          'vimeo.com',
          '*.ndla.filmiundervisning.no',
          'ndla.filmiundervisning.no',
          '*.prezi.com',
          'prezi.com',
          '*.commoncraft.com',
          'commoncraft.com',
          '*.embed.kahoot.it',
          '*.brightcove.net',
          'embed.kahoot.it',
          'fast.wistia.com',
          'https://khanacademy.org/',
          '*.khanacademy.org/',
        ],
        workerSrc: ["'self'", 'blob:'],
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
          'cdnjs.cloudflare.com',
        ],
        imgSrc: [
          "'self'",
          'https://*.ndla.no',
          'https://www.google-analytics.com',
          'https://stats.g.doubleclick.net',
          'http://metrics.brightcove.com',
          'https://httpsak-a.akamaihd.net',
          'https://*.boltdns.net',
          'https://www.nrk.no/',
          ' data:',
        ],
        mediaSrc: [
          "'self'",
          'blob:',
          'https://*.ndla.no',
          '*.brightcove.com',
          'brightcove.com',
        ],
        connectSrc,
      },
    },
    frameguard:
      process.env.NODE_ENV === 'development'
        ? {
            action: 'allow-from',
            domain: '*://localhost',
          }
        : undefined,
  }),
);

app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send('User-agent: *\nDisallow: /');
});

app.get('/health', (req, res) => {
  res.status(OK).json({ status: OK, text: 'Health check ok' });
});

app.get('/get_token', async (req, res) => {
  try {
    const token = await getToken();
    res.json(token);
  } catch (err) {
    log.error(err);
    res.status(INTERNAL_SERVER_ERROR).json('Internal server error');
  }
});

function sendInternalServerError(res) {
  if (res.getHeader('Content-Type') === 'application/json') {
    res.status(INTERNAL_SERVER_ERROR).json('Internal server error');
  } else {
    res.status(INTERNAL_SERVER_ERROR).send('Internal server error');
  }
}

function sendResponse(res, data, status = OK) {
  if (status === MOVED_PERMANENTLY) {
    res.writeHead(status, data);
    res.end();
  } else if (res.getHeader('Content-Type') === 'application/json') {
    res.status(status).json(data);
  } else {
    res.status(status).send(data);
  }
}

async function handleRequest(req, res, route) {
  try {
    const token = await getToken();
    storeAccessToken(token.access_token);
    try {
      const { data, status } = await route(req);
      sendResponse(res, data, status);
    } catch (e) {
      log.error(e);
      sendInternalServerError(res);
    }
  } catch (e) {
    log.error(e);
    sendInternalServerError(res);
  }
}

app.get('/article-iframe/:lang/:resourceId/:articleId', async (req, res) => {
  res.removeHeader('X-Frame-Options');
  handleRequest(req, res, iframeArticleRoute);
});

app.get('/oembed', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  handleRequest(req, res, oembedArticleRoute);
});

app.get('*', async (req, res) => handleRequest(req, res, defaultRoute));

module.exports = app;
