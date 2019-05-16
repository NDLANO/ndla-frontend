/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { ExperimentsContext } from '@ndla/abtest';
import WelcomePage from './containers/WelcomePage/WelcomePage';
import ArticlePage from './containers/ArticlePage/ArticlePage';
import PlainArticlePage from './containers/PlainArticlePage/PlainArticlePage';
import SearchPage from './containers/SearchPage/SearchPage';
import SubjectsPage from './containers/SubjectsPage/SubjectsPage';
import SubjectPage from './containers/SubjectPage/SubjectPage';
import TopicPage from './containers/TopicPage/TopicPage';
import NotFoundPage from './containers/NotFoundPage/NotFoundPage';
import App from './App';
import {
  ARTICLE_PAGE_PATH,
  PLAIN_ARTICLE_PAGE_PATH,
  SUBJECT_PAGE_PATH,
  SEARCH_PATH,
  TOPIC_PATH,
} from './constants';

export const routes = [
  {
    path: '/',
    hideMasthead: true,
    exact: true,
    component: WelcomePage,
    background: true,
  },
  {
    path: ARTICLE_PAGE_PATH,
    component: ArticlePage,
    background: true,
  },
  {
    path: PLAIN_ARTICLE_PAGE_PATH,
    component: PlainArticlePage,
    background: true,
  },
  {
    path: SEARCH_PATH,
    component: SearchPage,
    background: true,
  },
  {
    path: TOPIC_PATH,
    component: TopicPage,
    background: true,
  },
  {
    path: SUBJECT_PAGE_PATH,
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
  return (
    <ExperimentsContext.Provider
      value={{
        experiments: initialProps.experiments,
      }}>
      <App initialProps={initialProps} locale={locale} />
    </ExperimentsContext.Provider>
  );
}
