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
import { ApolloProvider } from 'react-apollo';
import { hydrate } from 'emotion';
import { getLocaleInfoFromPath } from '../i18n';
import { createApolloClient } from '../util/apiHelpers';
import LtiProvider from './LtiProvider';
import '../style/index.css';

const {
  DATA: { initialProps, config, ids },
} = window;
const { abbreviation, messages, basename } = getLocaleInfoFromPath(
  window.location.pathname,
);
console.log(window.DATA);
hydrate(ids);

const { logglyApiKey, logEnvironment: environment, componentName } = config;

const disableSSR = true;

window.errorReporter = ErrorReporter.getInstance({
  logglyApiKey,
  environment,
  componentName,
  ignoreUrls: [/https:\/\/.*hotjar\.com.*/],
});

const renderOrHydrate = disableSSR ? ReactDOM.render : ReactDOM.hydrate;

const client = createApolloClient(abbreviation);

const renderApp = () => {
  renderOrHydrate(
    <ApolloProvider client={client}>
      <IntlProvider locale={abbreviation} messages={messages}>
        <LtiProvider {...initialProps} />
      </IntlProvider>
    </ApolloProvider>,
    document.getElementById('root'),
  );
};

renderApp();

if (module.hot) {
  module.hot.accept();
}
