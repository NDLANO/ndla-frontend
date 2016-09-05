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
import ArticlePage from '../article/ArticlePage';
import SearchPage from '../search/SearchPage';
import NotFound from './NotFound';


export default function () {
  return (
    <Route path="/" component={App}>
      <IndexRoute component={Welcome} />
      <Route path="article/:articleId(/)" component={ArticlePage} />
      <Route path="search(/)" component={SearchPage} />
      <Route path="*" status={404} component={NotFound} />
    </Route>
  );
}
