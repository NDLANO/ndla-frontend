/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import 'isomorphic-unfetch';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import Router from 'react-router-dom/Router';
import createHistory from 'history/createBrowserHistory';
import ErrorReporter from 'ndla-error-reporter';
import IntlProvider from 'ndla-i18n';
import { configureTracker } from 'ndla-tracker';
import { getLocaleObject, isValidLocale } from './i18n';
import { storeAccessToken } from './util/apiHelpers';
import configureStore from './configureStore';
import routes from './routes';
import './style/index.css';

const { DATA: { initialState, initialProps, config, accessToken } } = window;
const localeString = initialState.locale;
const locale = getLocaleObject(localeString);

const paths = window.location.pathname.split('/');
const basename = isValidLocale(paths[1]) ? `${paths[1]}` : '';
const browserHistory = basename ? createHistory({ basename }) : createHistory();

storeAccessToken(accessToken);
const store = configureStore(initialState);

const {
  disableSSR,
  logglyApiKey,
  logEnvironment: environment,
  componentName,
} = config;

window.errorReporter = ErrorReporter.getInstance({
  store,
  logglyApiKey,
  environment,
  componentName,
});

configureTracker({
  listen: browserHistory.listen,
  gaTrackingId: config.gaTrackingId,
  googleTagManagerId: config.googleTagManagerId,
});

const renderOrHydrate = disableSSR ? ReactDOM.render : ReactDOM.hydrate;

renderOrHydrate(
  <Provider store={store}>
    <IntlProvider locale={locale.abbreviation} messages={locale.messages}>
      <Router history={browserHistory}>
        {routes(initialProps, locale.abbreviation)}
      </Router>
    </IntlProvider>
  </Provider>,
  document.getElementById('root'),
);
