/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { Route, IndexRoute } from 'react-router';

import Welcome from './Welcome';
import App from './App';
import NotFound from './NotFound';


export default function () {
  return (
    <Route path="/" component={App}>
      <IndexRoute component={Welcome} />
      <Route path="*" component={NotFound} />
    </Route>
  );
}
