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
import ErrorReporter from '@ndla/error-reporter';
import IntlProvider from '@ndla/i18n';
import { MissingRouterContext } from '@ndla/safelink';
import { ApolloProvider } from '@apollo/react-hooks';
import { getLocaleInfoFromPath } from '../i18n';
import { createApolloClient } from '../util/apiHelpers';
import LtiProvider from './LtiProvider';
import '../style/index.css';

const {
  DATA: { initialProps, config },
} = window;
const { abbreviation, messages } = getLocaleInfoFromPath(
  window.location.pathname,
);

const { logglyApiKey, logEnvironment: environment, componentName } = config;

window.errorReporter = ErrorReporter.getInstance({
  logglyApiKey,
  environment,
  componentName,
  ignoreUrls: [/https:\/\/.*hotjar\.com.*/],
});

const client = createApolloClient(abbreviation);

ReactDOM.render(
  <ApolloProvider client={client}>
    <IntlProvider locale={abbreviation} messages={messages}>
      <MissingRouterContext.Provider value={true}>
        <LtiProvider {...initialProps} />
      </MissingRouterContext.Provider>
    </IntlProvider>
  </ApolloProvider>,
  document.getElementById('root'),
);

if (module.hot) {
  module.hot.accept();
}
