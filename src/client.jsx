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
import Router from 'react-router-dom/Router';
import ErrorReporter from '@ndla/error-reporter';
import IntlProvider from '@ndla/i18n';
import { ApolloProvider } from 'react-apollo';
import { configureTracker } from '@ndla/tracker';
import { hydrate } from 'emotion';
import { createHistory } from './history';
import { getLocaleInfoFromPath } from './i18n';
import { createApolloClient } from './util/apiHelpers';
import routes from './routes';
import './style/index.css';

const {
  DATA: { initialProps, config, ids },
} = window;
const { abbreviation, messages, basename } = getLocaleInfoFromPath(
  window.location.pathname,
);

hydrate(ids);

const browserHistory = createHistory(basename);

const {
  disableSSR,
  logglyApiKey,
  logEnvironment: environment,
  componentName,
} = config;

window.errorReporter = ErrorReporter.getInstance({
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

window.hasHydrated = false;
const renderOrHydrate = disableSSR ? ReactDOM.render : ReactDOM.hydrate;

const client = createApolloClient(abbreviation);

renderOrHydrate(
  <ApolloProvider client={client}>
    <IntlProvider locale={abbreviation} messages={messages}>
      <Router history={browserHistory}>
        {routes(initialProps, abbreviation)}
      </Router>
    </IntlProvider>
  </ApolloProvider>,
  document.getElementById('root'),
  () => {
    // See: /src/util/transformArticle.js for info on why this is needed.
    window.hasHydrated = true;
  },
);

if (module.hot) {
  module.hot.accept();
}
