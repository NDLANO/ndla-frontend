/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import 'babel-polyfill';
import 'unfetch/polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import BrowserRouter from 'react-router-dom/BrowserRouter';
import ErrorReporter from 'ndla-error-reporter';
import IntlProvider from 'ndla-i18n';

import { getLocaleObject, isValidLocale } from './i18n';
import { storeAccessToken } from '../src/util/apiHelpers';
import configureStore from './configureStore';
import routes from './routes';

const { DATA: { initialState, config, accessToken } } = window;
const localeString = initialState.locale;
const locale = getLocaleObject(localeString);

const paths = window.location.pathname.split('/');
const basename = isValidLocale(paths[1]) ? `${paths[1]}` : '';

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

const renderOrHydrate = disableSSR ? ReactDOM.render : ReactDOM.hydrate;

renderOrHydrate(
  <Provider store={store}>
    <IntlProvider locale={locale.abbreviation} messages={locale.messages}>
      <BrowserRouter basename={basename} onUpdate={() => window.scrollTo(0, 0)}>
        {routes}
      </BrowserRouter>
    </IntlProvider>
  </Provider>,
  document.getElementById('root'),
);
