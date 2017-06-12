/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { renderToString } from 'react-dom/server';
import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router';
import defined from 'defined';

import IntlProvider from '../src/components/IntlProvider';
import enableDevMiddleWare from './enableDevMiddleware';
import getConditionalClassnames from './getConditionalClassnames';
import routes from '../src/routes';
import configureStore from '../src/configureStore';
import rootSaga from '../src/sagas';
import { getLocaleObject, isValidLocale, getHtmlLang } from '../src/i18n';
import { fetchArticle } from '../src/containers/ArticlePage/articleApi';
import Html from './Html';
import config from '../src/config';
import { htmlTemplate, htmlErrorTemplate } from './oembedHtmlTemplate';
import { titleI18N } from '../src/util/i18nFieldFinder';
import { getToken } from './auth';

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
          " 'self' " +
            ' https://*.ndla.no' +
            ' https://www.google-analytics.com' +
            ' https://stats.g.doubleclick.net' +
            ' http://metrics.brightcove.com' +
            ' https://httpsak-a.akamaihd.net' +
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

const renderHtmlString = (
  locale,
  userAgentString,
  state = {},
  component = undefined,
) =>
  renderToString(
    <Html
      lang={locale}
      state={state}
      component={component}
      className={getConditionalClassnames(userAgentString)}
    />,
  );

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

function handleResponse(req, res, token) {
  const paths = req.url.split('/');
  const { abbreviation: locale, messages } = getLocaleObject(paths[1]);
  const userAgentString = req.headers['user-agent'];

  if (__DISABLE_SSR__) {
    // eslint-disable-line no-underscore-dangle
    const htmlString = renderHtmlString(locale, userAgentString, {
      accessToken: token.access_token,
      locale,
    });
    res.send(`<!doctype html>\n${htmlString}`);
    return;
  }

  const store = configureStore({ locale, accessToken: token.access_token });

  const basename = isValidLocale(paths[1]) ? `${paths[1]}` : '';

  const context = {};
  const component = (
    <Provider store={store}>
      <IntlProvider locale={locale} messages={messages}>
        <StaticRouter basename={basename} location={req.url} context={context}>
          {routes}
        </StaticRouter>
      </IntlProvider>
    </Provider>
  );

  if (context.url) {
    res.writeHead(301, {
      Location: context.url,
    });
    res.end();
  } else {
    store
      .runSaga(rootSaga)
      .done.then(() => {
        const state = store.getState();
        const htmlString = renderHtmlString(
          locale,
          userAgentString,
          state,
          component,
        );
        const status = defined(context.status, 200);
        res.status(status).send(`<!doctype html>\n${htmlString}`);
      })
      .catch(error => {
        res.status(500).send(error.message);
      });
  }

  // Trigger sagas for components by rendering them
  // https://github.com/yelouafi/redux-saga/issues/255#issuecomment-210275959
  renderToString(component);

  // Dispatch a close event so sagas stop listening after they have resolved
  store.close();
}

app.get('*', (req, res) => {
  getToken()
    .then(token => {
      handleResponse(req, res, token);
    })
    .catch(() => {
      res.status(500).send('Internal server error');
    });
});

module.exports = app;
