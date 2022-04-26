/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import fetch from 'node-fetch';
import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import { matchPath } from 'react-router-dom';
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
import { routes as appRoutes } from '../routes';
import { getLocaleInfoFromPath } from '../i18n';
import ltiConfig from './ltiConfig';
import {
  FILM_PAGE_PATH,
  NOT_FOUND_PAGE_PATH,
  UKR_PAGE_PATH,
} from '../constants';
import { generateOauthData } from './helpers/oauthHelper';
import {
  getFeideToken,
  getRedirectUrl,
  feideLogout,
} from './helpers/openidHelper';
import { podcastFeedRoute } from './routes/podcastFeedRoute';
import programmeSitemap from './programmeSitemap';
import config from '../config';
import {
  OK,
  INTERNAL_SERVER_ERROR,
  MOVED_PERMANENTLY,
  TEMPORARY_REDIRECT,
  BAD_REQUEST,
} from '../statusCodes';

// @ts-ignore
global.fetch = fetch;
const app = express();
const allowedBodyContentTypes = [
  'application/json',
  'application/x-www-form-urlencoded',
];

app.disable('x-powered-by');
app.enable('trust proxy');

const ndlaMiddleware = [
  express.static(process.env.RAZZLE_PUBLIC_DIR ?? '', {
    maxAge: 1000 * 60 * 60 * 24 * 365, // One year
  }),
  bodyParser.urlencoded({ extended: true }),
  bodyParser.json({
    type: req =>
      allowedBodyContentTypes.includes(req.headers['content-type'] ?? ''),
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

app.get('/robots.txt', ndlaMiddleware, (req: Request, res: Response) => {
  // Using ndla.no robots.txt
  if (req.hostname === 'ndla.no') {
    res.sendFile('robots.txt', { root: './build/' });
  } else {
    res.type('text/plain');
    res.send('User-agent: *\nDisallow: /');
  }
});

app.get('/health', ndlaMiddleware, (_req: Request, res: Response) => {
  res.status(OK).json({ status: OK, text: 'Health check ok' });
});

app.get(
  '/film',
  ndlaMiddleware,
  (_req: Request, res: Response, _next: NextFunction) => {
    res.redirect(FILM_PAGE_PATH);
  },
);

app.get(
  '/ukr',
  ndlaMiddleware,
  (_req: Request, res: Response, _next: NextFunction) => {
    res.redirect(`/en${UKR_PAGE_PATH}`);
  },
);

if (config.feideEnabled) {
  app.get('/feide/login', (req: Request, res: Response) => {
    getRedirectUrl(req)
      .then(json => {
        res
          .cookie('PKCE_code', json.verifier, {
            httpOnly: true,
          })
          .send(json);
      })
      .catch(() => sendInternalServerError(req, res));
  });

  app.get('/feide/token', (req: Request, res: Response) => {
    getFeideToken(req)
      .then(json => res.send(json))
      .catch(() => sendInternalServerError(req, res));
  });

  app.get('/feide/logout', (req: Request, res: Response) => {
    feideLogout(req)
      .then(logouturi => res.send({ url: logouturi }))
      .catch(() => sendInternalServerError(req, res));
  });
}

app.get(
  '/:lang?/subjects/:path(*)',
  ndlaMiddleware,
  (req: Request, res: Response, _next: NextFunction) => {
    const { lang, path } = req.params;
    res.redirect(301, lang ? `/${lang}/${path}` : `/${path}`);
  },
);

export async function sendInternalServerError(req: Request, res: Response) {
  if (res.getHeader('Content-Type') === 'application/json') {
    res.status(INTERNAL_SERVER_ERROR).json('Internal server error');
  } else {
    const { data } = await errorRoute(req);
    res.status(INTERNAL_SERVER_ERROR).send(data);
  }
}

function sendResponse(res: Response, data: any, status = OK) {
  if (status === MOVED_PERMANENTLY || status === TEMPORARY_REDIRECT) {
    res.writeHead(status, data);
    res.end();
  } else if (res.getHeader('Content-Type') === 'application/json') {
    res.status(status).json(data);
  } else {
    res.status(status).send(data);
  }
}

type RouteFunc = (req: Request) => any;

async function handleRequest(req: Request, res: Response, route: RouteFunc) {
  try {
    const { data, status } = await route(req);
    sendResponse(res, data, status);
  } catch (err) {
    handleError(err);
    await sendInternalServerError(req, res);
  }
}

app.get('/static/*', ndlaMiddleware);

const iframArticleCallback = async (req: Request, res: Response) => {
  res.removeHeader('X-Frame-Options');
  handleRequest(req, res, iframeArticleRoute);
};

app.get(
  '/article-iframe/:lang?/article/:articleId',
  ndlaMiddleware,
  iframArticleCallback,
);
app.get(
  '/article-iframe/:lang?/:taxonomyId/:articleId',
  ndlaMiddleware,
  iframArticleCallback,
);
app.post(
  '/article-iframe/:lang?/article/:articleId',
  ndlaMiddleware,
  iframArticleCallback,
);
app.post(
  '/article-iframe/:lang?/:taxonomyId/:articleId',
  ndlaMiddleware,
  iframArticleCallback,
);

app.get('/oembed', ndlaMiddleware, async (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  handleRequest(req, res, oembedArticleRoute);
});

app.get(
  '/lti/config.xml',
  ndlaMiddleware,
  async (_req: Request, res: Response) => {
    res.removeHeader('X-Frame-Options');
    res.setHeader('Content-Type', 'application/xml');
    res.send(ltiConfig());
  },
);

app.get(
  '/utdanningsprogram-sitemap.txt',
  ndlaMiddleware,
  async (_req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/txt');
    res.send(programmeSitemap());
  },
);

app.get('/podkast/:seriesId/feed.xml', ndlaMiddleware, podcastFeedRoute);
app.get(
  '/podkast/:seriesId_:seriesTitle/feed.xml',
  ndlaMiddleware,
  podcastFeedRoute,
);

app.post('/lti/oauth', ndlaMiddleware, async (req: Request, res: Response) => {
  const { body, query } = req;
  if (!body || !query.url) {
    res.send(BAD_REQUEST);
  }
  res.send(JSON.stringify(generateOauthData(query.url, body)));
});

app.post('/lti', ndlaMiddleware, async (req: Request, res: Response) => {
  res.removeHeader('X-Frame-Options');
  handleRequest(req, res, ltiRoute);
});

app.get('/lti', ndlaMiddleware, async (req: Request, res: Response) => {
  res.removeHeader('X-Frame-Options');
  handleRequest(req, res, ltiRoute);
});

/** Handle different paths to a node in old ndla. */
[
  'node',
  'printpdf',
  'easyreader',
  'contentbrowser/node',
  'print',
  'aktualitet',
  'oppgave',
  'fagstoff',
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
  (req: Request, _res: Response, next: NextFunction) => {
    const { basepath: path } = getLocaleInfoFromPath(req.path);
    const route = appRoutes.find(r => matchPath(path, r)); // match with routes used in frontend
    if (!route) {
      next('route'); // skip to next route (i.e. proxy)
    } else {
      next();
    }
  },
  ndlaMiddleware,
  (req: Request, res: Response) => {
    handleRequest(req, res, defaultRoute);
  },
);

app.get('/*', (_req: Request, res: Response, _next: NextFunction) => {
  res.redirect(NOT_FOUND_PAGE_PATH);
});
app.post('/*', (_req: Request, res: Response, _next: NextFunction) => {
  res.redirect(NOT_FOUND_PAGE_PATH);
});

export default app;
