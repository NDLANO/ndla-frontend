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
import defined from 'defined';
import webpack from 'webpack';
import { syncHistoryWithStore } from 'react-router-redux';
import { Provider } from 'react-redux';
// import createHistory from 'react-router/lib/createMemoryHistory';
import { createMemoryHistory, match, RouterContext } from 'react-router';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import configureRoutes from '../src/main/routes';
import configureStore from '../src/configureStore';
import rootSaga from '../src/sagas';


import webpackConfig from '../webpack.config.dev';
import { getHtmlLang } from '../src/locale/configureLocale';
import Html from './Html';

const app = express();

if (process.env.NODE_ENV === 'development') {
  const compiler = webpack(webpackConfig);
  app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    stats: {
      colors: true,
    },
    publicPath: webpackConfig.output.publicPath,
  }));
  app.use(webpackHotMiddleware(compiler, {}));
}

app.use(compression());
app.use(express.static('htdocs', {
  maxAge: 1000 * 60 * 60 * 24 * 365, // One year
}));

const findIEClass = (userAgentString) => {
  if (userAgentString.indexOf('MSIE') >= 0) {
    return 'ie lt-ie11';
  } else if (userAgentString.indexOf('Trident/7.0; rv:11.0') >= 0) {
    return 'ie gt-ie10';
  }
  return '';
};

app.get('*', (req, res) => {
  const paths = req.url.split('/');
  const lang = getHtmlLang(defined(paths[1], ''));
  function renderOnClient() {
    res.send('<!doctype html>\n' + renderToString(<Html lang={lang} className={findIEClass(req.headers['user-agent'])} />)); // eslint-disable-line
  }

  if (global.__DISABLE_SSR__) { // eslint-disable-line no-underscore-dangle
    renderOnClient();
  }

  const store = configureStore({
    messages: [],
    locale: lang,
  });

  const memoryHistory = createMemoryHistory(req.originalUrl);
  const history = syncHistoryWithStore(memoryHistory, store);

  match({ history, routes: configureRoutes(store), location: req.url }, (err, redirectLocation, props) => {
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
          <RouterContext {...props} />
        </Provider>);

      // TODO: Add error handling
      store.runSaga(rootSaga).done.then(() => {
        const state = store.getState();
        const htmlString = renderToString(
          <Html
            lang={lang} state={state} component={component} className={findIEClass(req.headers['user-agent'])}
          />
        );
        res.send('<!doctype html>\n' + htmlString); // eslint-disable-line
      });

      // Trigger sagas for component to run (should not have any performance implications)
			// https://github.com/yelouafi/redux-saga/issues/255#issuecomment-210275959
      renderToString(component);

			// Dispatch a close event so sagas stop listening after they're resolved
      store.close();
    } else {
      // TODO: render a custom 404 view here
      res.sendStatus(404);
    }
  });
  return;
});

module.exports = app;
