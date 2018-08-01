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
import { ApolloProvider } from 'react-apollo';
import { configureTracker } from 'ndla-tracker';
import { getLocaleInfoFromPath } from './i18n';
import { storeAccessToken, createApolloClient } from './util/apiHelpers';
import configureStore from './configureStore';
import routes from './routes';
import './style/index.css';

const {
  DATA: { initialState, initialProps, config, accessToken },
} = window;
const { abbreviation, messages, basename } = getLocaleInfoFromPath(
  window.location.pathname,
);

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
  ignoreUrls: [/https:\/\/.*hotjar\.com.*/],
});

configureTracker({
  listen: browserHistory.listen,
  gaTrackingId: config.gaTrackingId,
  googleTagManagerId: config.googleTagManagerId,
});

const renderOrHydrate = disableSSR ? ReactDOM.render : ReactDOM.hydrate;

const client = createApolloClient(abbreviation);

const renderApp = () => {
  renderOrHydrate(
    <Provider store={store}>
      <ApolloProvider client={client}>
        <IntlProvider locale={abbreviation} messages={messages}>
          <Router history={browserHistory}>
            {routes(initialProps, abbreviation)}
          </Router>
        </IntlProvider>
      </ApolloProvider>
    </Provider>,
    document.getElementById('root'),
  );
};

renderApp();

if (module.hot) {
  module.hot.accept('./routes', () => {
    renderApp();
  });
}
