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

import IntlProvider from './components/IntlProvider';
import { getLocaleObject, isValidLocale } from './i18n';
import { storeAccessToken } from '../src/util/apiHelpers';
import configureStore from './configureStore';
import routes from './routes';
import rootSaga from './sagas';

const initialState = window.initialState;
const localeString = initialState.locale;
const locale = getLocaleObject(localeString);

const paths = window.location.pathname.split('/');
const basename = isValidLocale(paths[1]) ? `${paths[1]}` : '';

storeAccessToken(window.accessToken);
const store = configureStore(initialState);

store.runSaga(rootSaga);

const {
  logglyApiKey,
  logEnvironment: environment,
  componentName,
} = window.config;

window.errorReporter = ErrorReporter.getInstance({
  store,
  logglyApiKey,
  environment,
  componentName,
});

ReactDOM.render(
  <Provider store={store}>
    <IntlProvider locale={locale.abbreviation} messages={locale.messages}>
      <BrowserRouter basename={basename} onUpdate={() => window.scrollTo(0, 0)}>
        {routes}
      </BrowserRouter>
    </IntlProvider>
  </Provider>,
  document.getElementById('root'),
);
