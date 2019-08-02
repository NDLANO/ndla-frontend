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
import FilmFrontpage from './containers/FilmFrontpage/NdlaFilmFrontpage';
import PlainLearningpathPage from './containers/PlainLearningpathPage/PlainLearningpathPage';
import LearningpathPage from './containers/LearningpathPage/LearningpathPage';

import App from './App';
import {
  ARTICLE_PAGE_PATH,
  PLAIN_ARTICLE_PAGE_PATH,
  SUBJECT_PAGE_PATH,
  SEARCH_PATH,
  TOPIC_PATH,
  FILM_PAGE_PATH,
  PLAIN_LEARNINGPATH_PAGE_PATH,
  PLAIN_LEARNINGPATHSTEP_PAGE_PATH,
  LEARNINGPATH_PAGE_PATH,
  LEARNINGPATHSTEP_PAGE_PATH,
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
    path: LEARNINGPATHSTEP_PAGE_PATH,
    component: LearningpathPage,
    background: true,
  },
  {
    path: LEARNINGPATH_PAGE_PATH,
    component: LearningpathPage,
    background: true,
  },
  {
    path: PLAIN_LEARNINGPATHSTEP_PAGE_PATH,
    component: PlainLearningpathPage,
    background: true,
  },
  {
    path: PLAIN_LEARNINGPATH_PAGE_PATH,
    component: PlainLearningpathPage,
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
    path: FILM_PAGE_PATH.replace(':', '\\:'),
    exact: true,
    component: FilmFrontpage,
    background: false,
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
  return <App initialProps={initialProps} locale={locale} />;
}
