/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import fetch from 'node-fetch';
import express from 'express';
import proxy from 'express-http-proxy';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import {
  OK,
  INTERNAL_SERVER_ERROR,
  MOVED_PERMANENTLY,
  TEMPORARY_REDIRECT,
} from 'http-status';
import matchPath from 'react-router-dom/matchPath';
import {
  defaultRoute,
  errorRoute,
  oembedArticleRoute,
  iframeArticleRoute,
  forwardingRoute,
  ltiRoute,
} from './routes';
import contentSecurityPolicy from './contentSecurityPolicy';
import handleError from '../util/handleError';
import config from '../config';
import { routes as appRoutes } from '../routes';
import { getLocaleInfoFromPath } from '../i18n';
import ltiConfig from './ltiConfig';

global.fetch = fetch;
const app = express();
const allowedBodyContentTypes = [
  'application/json',
  'application/x-www-form-urlencoded',
];

app.disable('x-powered-by');
app.enable('trust proxy');

const ndlaMiddleware = [
  express.static(process.env.RAZZLE_PUBLIC_DIR, {
    maxAge: 1000 * 60 * 60 * 24 * 365, // One year
  }),
  bodyParser.urlencoded({ extended: true }),
  bodyParser.json({
    type: req => allowedBodyContentTypes.includes(req.headers['content-type']),
  }),
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
        : { action: 'allow-from', domain: '*://sti.ndla.no' },
  }),
];

app.get('/robots.txt', ndlaMiddleware, (req, res) => {
  // Using ndla.no robots.txt
  if (req.hostname === 'ndla.no') {
    res.sendFile('robots.txt', { root: './build/' });
  } else {
    res.type('text/plain');
    res.send('User-agent: *\nDisallow: /');
  }
});

app.get('/health', ndlaMiddleware, (req, res) => {
  res.status(OK).json({ status: OK, text: 'Health check ok' });
});

async function sendInternalServerError(req, res) {
  if (res.getHeader('Content-Type') === 'application/json') {
    res.status(INTERNAL_SERVER_ERROR).json('Internal server error');
  } else {
    const { data } = await errorRoute(req);
    res.status(INTERNAL_SERVER_ERROR).send(data);
  }
}

function sendResponse(res, data, status = OK) {
  if (status === MOVED_PERMANENTLY || status === TEMPORARY_REDIRECT) {
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
    const { data, status } = await route(req);
    sendResponse(res, data, status);
  } catch (e) {
    handleError(e);
    await sendInternalServerError(req, res);
  }
}

app.get('/static/*', ndlaMiddleware);

const iframArticleCallback = async (req, res) => {
  res.removeHeader('X-Frame-Options');
  handleRequest(req, res, iframeArticleRoute);
};

app.get(
  '/article-iframe/:lang/article/:articleId',
  ndlaMiddleware,
  iframArticleCallback,
);
app.get(
  '/article-iframe/:lang/:resourceId/:articleId',
  ndlaMiddleware,
  iframArticleCallback,
);
app.post(
  '/article-iframe/:lang/article/:articleId',
  ndlaMiddleware,
  iframArticleCallback,
);
app.post(
  '/article-iframe/:lang/:resourceId/:articleId',
  ndlaMiddleware,
  iframArticleCallback,
);

app.get('/oembed', ndlaMiddleware, async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  handleRequest(req, res, oembedArticleRoute);
});

app.get('/lti/config.xml', ndlaMiddleware, async (req, res) => {
  res.removeHeader('X-Frame-Options');
  res.setHeader('Content-Type', 'application/xml');
  res.send(ltiConfig());
});

app.post('/lti', ndlaMiddleware, async (req, res) => {
  res.removeHeader('X-Frame-Options');
  handleRequest(req, res, ltiRoute);
});

app.get('/lti', ndlaMiddleware, async (req, res) => {
  res.removeHeader('X-Frame-Options');
  handleRequest(req, res, ltiRoute);
});

app.get('/:lang?/search/apachesolr_search(/*)?', proxy(config.oldNdlaProxyUrl));

/** Handle different paths to a node in old ndla. */
[
  'node',
  'printpdf',
  'easyreader',
  'contentbrowser/node',
  'print',
  'aktualitet',
].forEach(path => {
  app.get(`/:lang?/${path}/:nodeId`, async (req, res, next) =>
    forwardingRoute(req, res, next),
  );
  app.get(`/:lang?/${path}/:nodeId/*`, async (req, res, next) =>
    forwardingRoute(req, res, next),
  );
});

app.get('/favicon.ico', ndlaMiddleware);
app.get(
  '/*',
  (req, res, next) => {
    const { basepath: path } = getLocaleInfoFromPath(req.path);
    const route = appRoutes.find(r => matchPath(path, r)); // match with routes used in frontend
    if (!route) {
      next('route'); // skip to next route (i.e. proxy)
    } else {
      next();
    }
  },
  ndlaMiddleware,
  (req, res) => {
    handleRequest(req, res, defaultRoute);
  },
);

app.get('/*', proxy(config.oldNdlaProxyUrl));
app.post('/*', proxy(config.oldNdlaProxyUrl));

export default app;
