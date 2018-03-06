/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import 'isomorphic-unfetch';
import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import { OK, INTERNAL_SERVER_ERROR, MOVED_PERMANENTLY } from 'http-status';

import { getToken } from './helpers/auth';
import { defaultRoute } from './routes/defaultRoute';
import { oembedArticleRoute } from './routes/oembedArticleRoute';
import { iframeArticleRoute } from './routes/iframeArticleRoute';
import { storeAccessToken } from '../util/apiHelpers';
import contentSecurityPolicy from './contentSecurityPolicy';
import handleError from '../util/handleError';

const app = express();

app.disable('x-powered-by');

app.use(compression());
app.use(
  express.static(process.env.RAZZLE_PUBLIC_DIR, {
    maxAge: 1000 * 60 * 60 * 24 * 365, // One year
  }),
);

app.use(
  helmet({
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
    },
    contentSecurityPolicy,
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
    handleError(err);
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
      handleError(e);
      sendInternalServerError(res);
    }
  } catch (e) {
    handleError(e);
    sendInternalServerError(res);
  }
}

app.get('/article-iframe/:lang/article/:articleId', async (req, res) => {
  res.removeHeader('X-Frame-Options');
  handleRequest(req, res, iframeArticleRoute);
});

app.get('/article-iframe/:lang/:resourceId/:articleId', async (req, res) => {
  res.removeHeader('X-Frame-Options');
  handleRequest(req, res, iframeArticleRoute);
});

app.get('/oembed', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  handleRequest(req, res, oembedArticleRoute);
});

app.get('/*', async (req, res) => handleRequest(req, res, defaultRoute));

export default app;
