/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import WelcomePage from './containers/WelcomePage/WelcomePage';
import ArticlePage from './containers/ArticlePage/ArticlePage';
import PlainArticlePage from './containers/PlainArticlePage/PlainArticlePage';
import SearchPage from './containers/SearchPage/SearchPage';
import SubjectsPage from './containers/SubjectsPage/SubjectsPage';
import SubjectPage from './containers/SubjectPage/SubjectPage';
import TopicPage from './containers/TopicPage/TopicPage';
import NotFoundPage from './containers/NotFoundPage/NotFoundPage';
import config from './config';
import App from './App';

const searchEnabled =
  process.env.BUILD_TARGET === 'server' || process.env.NODE_ENV === 'unittest'
    ? config.searchEnabled
    : window.DATA.config.searchEnabled;

export const articlePath =
  '/subjects/:subjectId/:topicPath*/:topicId/resource\\::resourceId';

export const routes = [
  {
    path: '/',
    exact: true,
    component: WelcomePage,
    background: false,
  },
  {
    path: articlePath,
    component: ArticlePage,
    background: true,
  },
  {
    path: '/article/:articleId',
    component: PlainArticlePage,
    background: true,
  },
  {
    path: '/search',
    component: searchEnabled ? SearchPage : NotFoundPage,
    background: false,
  },
  {
    path: '/subjects/:subjectId/(.*)/:topicId',
    component: TopicPage,
    background: true,
  },
  {
    path: '/subjects/:subjectId/:topicId',
    component: TopicPage,
    background: true,
  },
  {
    path: '/subjects/:subjectId/',
    component: SubjectPage,
    background: true,
  },
  {
    path: '/subjects',
    component: SubjectsPage,
    background: false,
  },
  {
    component: NotFoundPage,
    background: false,
  },
];

export default function(initialProps = {}, locale) {
  return <App initialProps={initialProps} locale={locale} />;
}
