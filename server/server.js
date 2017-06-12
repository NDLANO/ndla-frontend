/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import express from 'express';
import compression from 'compression';
import defined from 'defined';

import enableDevMiddleWare from './helpers/enableDevMiddleware';
import { isValidLocale, getHtmlLang } from '../src/i18n';
import { fetchArticle } from '../src/containers/ArticlePage/articleApi';
import config from '../src/config';
import { htmlTemplate, htmlErrorTemplate } from './helpers/oembedHtmlTemplate';
import { titleI18N } from '../src/util/i18nFieldFinder';
import { getToken } from './auth';
import { defaultRoute } from './routes/default';

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

function handleArticleIframeResponse(req, res, token) {
  const lang = getHtmlLang(defined(req.params.lang, ''));
  const articleId = req.params.id;
  fetchArticle(articleId, lang, token.access_token)
    .then(article => {
      res.send(
        htmlTemplate(
          lang,
          article.content,
          article.introduction,
          titleI18N(article, lang, true),
        ),
      );
      res.end();
    })
    .catch(error => {
      res.status(error.status).send(htmlErrorTemplate(lang, error));
    });
}

app.get('/article-iframe/:lang/:id', (req, res) => {
  getToken()
    .then(token => {
      handleArticleIframeResponse(req, res, token);
    })
    .catch(err => res.status(500).send(err.message));
});

function handleOembedResponse(req, res, token) {
  res.setHeader('Content-Type', 'application/json');
  // http://ndla-frontend.test.api.ndla.no/article/3023
  const url = req.query.url;
  if (!url) {
    res.status(404).json({ status: 404, text: 'Url not found' });
  }
  const paths = url.split('/');
  const articleId = paths.length > 5 ? paths[5] : paths[4];
  const lang = paths.length > 2 && isValidLocale(paths[3]) ? paths[3] : 'nb';
  fetchArticle(articleId, lang, token.access_token)
    .then(article => {
      res.json({
        type: 'rich',
        version: '1.0', // oEmbed version
        height: req.query.height ? req.query.height : 800,
        width: req.query.width ? req.query.width : 800,
        title: titleI18N(article, lang, true),
        html: `<iframe src="${config.ndlaFrontendDomain}/article-iframe/${lang}/${articleId}" frameborder="0" />`,
      });
    })
    .catch(error => {
      res.status(error.status).json(error.message);
    });
}

app.get('/oembed', (req, res) => {
  getToken()
    .then(token => {
      handleOembedResponse(req, res, token);
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
