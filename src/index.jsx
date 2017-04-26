/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import 'babel-polyfill';
import 'url-search-params-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';
import { IntlProvider } from 'react-intl';
import ErrorReporter from 'ndla-error-reporter';

import { getLocaleObject, isValidLocale } from './i18n';
import configureHistory from './configureHistory';
import configureStore from './configureStore';
import configureRoutes from './routes';
import rootSaga from './sagas';

const initialState = window.initialState;
const localeString = initialState.locale;
const locale = getLocaleObject(localeString);

const paths = window.location.pathname.split('/');
const basename = isValidLocale(paths[1]) ? `${paths[1]}` : '';

const store = configureStore(
  initialState,
);

store.runSaga(rootSaga);

const history = configureHistory(createHistory({ basename }));

const routes = configureRoutes(store);

if (__CLIENT__) {
  const { logglyApiKey, logEnvironment: environment, componentName } = window.config;
  window.errorReporter = ErrorReporter.getInstance({ store, logglyApiKey, environment, componentName });
}

ReactDOM.render(
  <Provider store={store}>
    <IntlProvider locale={locale.abbreviation} messages={locale.messages}>
      <Router history={history} onUpdate={() => window.scrollTo(0, 0)}>
        {routes}
      </Router>
    </IntlProvider>
  </Provider>,
  document.getElementById('root'),
);
