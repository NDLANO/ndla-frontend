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
import compression from 'compression';
import { syncHistoryWithStore } from 'react-router-redux';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { match, RouterContext } from 'react-router';
import defined from 'defined';

import enableDevMiddleWare from './enableDevMiddleware';
import getConditionalClassnames from './getConditionalClassnames';
import createMemoryHistory from './createMemoryHistory';
import configureRoutes from '../src/routes';
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
app.use(express.static('htdocs', {
  maxAge: 1000 * 60 * 60 * 24 * 365, // One year
}));

const renderHtmlString = (locale, userAgentString, state = {}, component = undefined) =>
  renderToString(<Html lang={locale} state={state} component={component} className={getConditionalClassnames(userAgentString)} />);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 200, text: 'Health check ok' });
});

function handleArticleIframeResponse(req, res, token) {
  const lang = getHtmlLang(defined(req.params.lang, ''));
  const articleId = req.params.id;
  fetchArticle(articleId, lang, token.access_token)
    .then((article) => {
      res.send(htmlTemplate(lang, article.content, article.introduction, titleI18N(article, lang, true)));
      res.end();
    }).catch((error) => {
      res.status(error.status).send(htmlErrorTemplate(lang, error));
    });
}

app.get('/article-iframe/:lang/:id', (req, res) => {
  getToken().then((token) => {
    handleArticleIframeResponse(req, res, token);
  }).catch(err => res.status(500).send(err.message));
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
    .then((article) => {
      res.json({
        type: 'rich',
        version: '1.0', // oEmbed version
        height: req.query.height ? req.query.height : 800,
        width: req.query.width ? req.query.width : 800,
        title: titleI18N(article, lang, true),
        html: `<iframe src="${config.ndlaFrontendDomain}/article-iframe/${lang}/${articleId}" frameborder="0" />`,
      });
    }).catch((error) => {
      res.status(error.status).json(error.message);
    });
}

app.get('/oembed', (req, res) => {
  getToken().then((token) => {
    handleOembedResponse(req, res, token);
  }).catch(err => res.status(500).send(err.message));
});

app.get('/get_token', (req, res) => {
  getToken().then((token) => {
    res.send(token);
  }).catch(err => res.status(500).send(err.message));
});

function handleResponse(req, res, token) {
  const paths = req.url.split('/');
  const { abbreviation: locale, messages } = getLocaleObject(paths[1]);
  const userAgentString = req.headers['user-agent'];


  if (global.__DISABLE_SSR__) { // eslint-disable-line no-underscore-dangle
    const htmlString = renderHtmlString(locale, userAgentString, { accessToken: token.access_token });
    res.send(`<!doctype html>\n${htmlString}`);
    return;
  }
  const options = isValidLocale(paths[1]) ? { basename: `/${locale}/` } : {};
  const location = !options.basename ? req.url : req.url.replace(`${locale}/`, '');
  const memoryHistory = createMemoryHistory(req.url, options);

  const store = configureStore({ locale, accessToken: token.access_token }, memoryHistory);

  const history = syncHistoryWithStore(memoryHistory, store);

  match({ history, routes: configureRoutes(store), basename: `/${locale}`, location }, (err, redirectLocation, props) => {
    if (err) {
      // something went badly wrong, so 500 with a message
      res.status(500).send(err.message);
    } else if (redirectLocation) {
      // we matched a ReactRouter redirect, so redirect from the server
      res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    } else if (props) {
      // if we got props, that means we found a valid component to render for the given route
      const component =
        (<Provider store={store}>
          <IntlProvider locale={locale} messages={messages}>
            <RouterContext {...props} />
          </IntlProvider>
        </Provider>);

      store.runSaga(rootSaga).done
        .then(() => {
          const state = store.getState();
          const htmlString = renderHtmlString(locale, userAgentString, state, component);
          const status = props.routes.find(r => r.status === 404) !== undefined ? 404 : 200;
          res.status(status).send(`<!doctype html>\n${htmlString}`);
        })
        .catch(((error) => {
          res.status(500).send(error.message);
        }));

      // Trigger sagas for components by rendering them (should not have any performance implications)
      // https://github.com/yelouafi/redux-saga/issues/255#issuecomment-210275959
      renderToString(component);

      // Dispatch a close event so sagas stop listening after they have resolved
      store.close();
    } else {
      res.sendStatus(500);
    }
  });
}

app.get('*', (req, res) => {
  getToken().then((token) => {
    handleResponse(req, res, token);
  }).catch(err => res.status(500).send(err.message));
});

module.exports = app;
