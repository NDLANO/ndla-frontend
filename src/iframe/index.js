/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import ReactDOM from 'react-dom';
import { configureTracker } from '@ndla/tracker';
import ErrorReporter from '@ndla/error-reporter';
import IframePageContainer from './IframePageContainer';

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

configureTracker({
  listen: () => {},
  gaTrackingId: config.gaTrackingId,
  googleTagManagerId: config.googleTagManagerId,
});

const renderOrHydrate = disableSSR ? ReactDOM.render : ReactDOM.hydrate;
renderOrHydrate(
  <IframePageContainer {...initialProps} />,
  document.getElementById('root'),
);

if (module.hot) {
  module.hot.accept();
}
