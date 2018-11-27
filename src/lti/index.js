/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import ReactDOM from 'react-dom';
import ErrorReporter from '@ndla/error-reporter';
 import LtiProvider from './LtiProvider';

const { config, initialProps } = window.DATA;


const {
  logglyApiKey,
  logEnvironment: environment,
  componentName,
} = config;

window.errorReporter = ErrorReporter.getInstance({
  logglyApiKey,
  environment,
  componentName,
});


ReactDOM.render(
  <LtiProvider {...initialProps} />,
  document.getElementById('root'),
);

if (module.hot) {
  module.hot.accept();
}
