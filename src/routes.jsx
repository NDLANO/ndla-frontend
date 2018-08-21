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
import SearchContainer from './containers/SearchPage/SearchContainer';
import SubjectsPage from './containers/SubjectsPage/SubjectsPage';
import SubjectPage from './containers/SubjectPage/SubjectPage';
import TopicPage from './containers/TopicPage/TopicPage';
import NotFoundPage from './containers/NotFoundPage/NotFoundPage';
import App from './App';

export const articlePath =
  '/subjects/:subjectId/:topicPath*/:topicId/resource\\::resourceId';

export const simpleArticlePath = '/article/:articleId';

export const routes = [
  {
    path: '/',
    hideMasthead: true,
    exact: true,
    component: WelcomePage,
    background: true,
  },
  {
    path: articlePath,
    component: ArticlePage,
    background: true,
  },
  {
    path: simpleArticlePath,
    component: PlainArticlePage,
    background: true,
  },
  {
    path: '/search(.*)',
    component: SearchContainer,
    background: true,
  },
  {
    path: '/subjects/:subjectId/:topicPath(.*)?/:topicId',
    component: TopicPage,
    background: true,
  },
  {
    path: '/subjects/:subjectId',
    component: SubjectPage,
    background: false,
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
