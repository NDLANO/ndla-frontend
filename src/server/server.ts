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
import { matchPath } from 'react-router-dom';
import { getCookie } from '@ndla/util';
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
import { privateRoutes, routes } from '../routes';
import { getLocaleInfoFromPath } from '../i18n';
import ltiConfig from './ltiConfig';
import {
  FILM_PAGE_PATH,
  NOT_FOUND_PAGE_PATH,
  STORED_LANGUAGE_COOKIE_KEY,
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
import {
  OK,
  INTERNAL_SERVER_ERROR,
  MOVED_PERMANENTLY,
  TEMPORARY_REDIRECT,
  BAD_REQUEST,
} from '../statusCodes';
import { isAccessTokenValid } from '../util/authHelpers';
import { constructNewPath } from '../util/urlHelper';
import { getDefaultLocale } from '../config';

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
  express.urlencoded({ extended: true }),
  express.json({
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
            action: 'sameorigin',
          }
        : { action: 'deny' },
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
    res.cookie(STORED_LANGUAGE_COOKIE_KEY, 'en');
    res.redirect(`/en${UKR_PAGE_PATH}`);
  },
);

const getLang = (
  paramLang?: string,
  cookieLang?: string | null,
): string | undefined => {
  if (paramLang) {
    return paramLang;
  }
  if (!paramLang && cookieLang && cookieLang !== getDefaultLocale()) {
    return cookieLang;
  }
  return undefined;
};

app.get('/:lang?/login', async (req: Request, res: Response) => {
  const feideCookie = getCookie('feide_auth', req.headers.cookie ?? '') ?? '';
  const feideToken = !!feideCookie ? JSON.parse(feideCookie) : undefined;
  const state = typeof req.query.state === 'string' ? req.query.state : '';
  res.setHeader('Cache-Control', 'private');
  const lang = getLang(
    req.params.lang,
    getCookie(STORED_LANGUAGE_COOKIE_KEY, req.headers.cookie ?? ''),
  );
  const redirect = constructNewPath(state, lang);

  if (feideToken && isAccessTokenValid(feideToken)) {
    return res.redirect(state);
  }
  try {
    const { verifier, url } = await getRedirectUrl(req, redirect);
    res.cookie('PKCE_code', verifier, { httpOnly: true });
    return res.redirect(url);
  } catch (e) {
    return await sendInternalServerError(req, res);
  }
});

app.get('/login/success', async (req: Request, res: Response) => {
  const code = typeof req.query.code === 'string' ? req.query.code : undefined;
  const state = typeof req.query.state === 'string' ? req.query.state : '/';
  const verifier = getCookie('PKCE_code', req.headers.cookie ?? '');
  if (!code || !verifier) {
    return await sendInternalServerError(req, res);
  }

  try {
    const token = await getFeideToken(req, verifier, code);
    const feideCookie = {
      ...token,
      ndla_expires_at: (token.expires_at ?? 0) * 1000,
    };
    res.cookie('feide_auth', JSON.stringify(feideCookie), {
      expires: new Date(feideCookie.ndla_expires_at),
      encode: String,
    });
    const languageCookie = getCookie(
      STORED_LANGUAGE_COOKIE_KEY,
      req.headers.cookie ?? '',
    );
    //workaround to ensure language cookie is set before redirecting to state path
    if (!languageCookie) {
      const { basename } = getLocaleInfoFromPath(state);
      res.cookie(
        STORED_LANGUAGE_COOKIE_KEY,
        basename.length ? basename : getDefaultLocale(),
      );
    }
    return res.redirect(state);
  } catch (e) {
    return await sendInternalServerError(req, res);
  }
});

app.get('/:lang?/logout', async (req: Request, res: Response) => {
  const feideCookie = getCookie('feide_auth', req.headers.cookie ?? '') ?? '';
  const feideToken = !!feideCookie ? JSON.parse(feideCookie) : undefined;
  const state = typeof req.query.state === 'string' ? req.query.state : '/';
  const redirect = constructNewPath(state, req.params.lang);

  if (!feideToken?.['id_token'] || typeof state !== 'string') {
    return sendInternalServerError(req, res);
  }
  try {
    const logoutUri = await feideLogout(req, redirect, feideToken['id_token']);
    return res.redirect(logoutUri);
  } catch (_) {
    return await sendInternalServerError(req, res);
  }
});

app.get('/logout/session', (req: Request, res: Response) => {
  res.clearCookie('feide_auth');
  const state = typeof req.query.state === 'string' ? req.query.state : '/';
  const { basepath, basename } = getLocaleInfoFromPath(state);
  const wasPrivateRoute = privateRoutes.some(r => matchPath(r, basepath));
  const redirect = wasPrivateRoute ? constructNewPath('/', basename) : state;
  return res.redirect(redirect);
});

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
  (req: Request, res: Response, next: NextFunction) => {
    const { basepath: path } = getLocaleInfoFromPath(req.path);
    const route = routes.find(r => matchPath(r, path)); // match with routes used in frontend
    const isPrivate = privateRoutes.some(r => matchPath(r, path));
    const feideCookie = getCookie('feide_auth', req.headers.cookie ?? '') ?? '';
    const feideToken = !!feideCookie ? JSON.parse(feideCookie) : undefined;
    const isTokenValid = !!feideToken && isAccessTokenValid(feideToken);
    const shouldRedirect = isPrivate && !isTokenValid;
    if (!route) {
      next('route'); // skip to next route (i.e. proxy)
    } else if (shouldRedirect) {
      return res.redirect(`/login?state=${req.path}`);
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
