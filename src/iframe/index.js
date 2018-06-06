/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import ReactDOM from 'react-dom';
import ErrorReporter from 'ndla-error-reporter';
import IframeArticlePage from './IframeArticlePage';

const { config, initialProps } = window.DATA;

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
});

const renderOrHydrate = disableSSR ? ReactDOM.render : ReactDOM.hydrate;

renderOrHydrate(
  <IframeArticlePage {...initialProps} />,
  document.getElementById('root'),
);

if (module.hot) {
  module.hot.accept();
}
