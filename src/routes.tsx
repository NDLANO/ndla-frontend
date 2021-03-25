/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { RouteProps } from 'react-router';
// @ts-ignore
import WelcomePage from './containers/WelcomePage/WelcomePage';
// @ts-ignore
import PlainArticlePage from './containers/PlainArticlePage/PlainArticlePage';
// @ts-ignore
import SearchPage from './containers/SearchPage/SearchPage';
// @ts-ignore
import AllSubjectsPage from './containers/AllSubjectsPage/AllSubjectsPage';
// @ts-ignore
import SubjectPage from './containers/SubjectPage/SubjectPage';
// @ts-ignore
import NotFoundPage from './containers/NotFoundPage/NotFoundPage';
// @ts-ignore
import FilmFrontpage from './containers/FilmFrontpage/NdlaFilmFrontpage';
// @ts-ignore
import PlainLearningpathPage from './containers/PlainLearningpathPage/PlainLearningpathPage';
// @ts-ignore
import ResourcePage from './containers/ResourcePage/ResourcePage';
// @ts-ignore
import MultidisciplinarySubjectPage from './containers/MultidisciplinarySubject/MultidisciplinarySubjectPage';
// @ts-ignore
import MultidisciplinarySubjectArticlePage from './containers/MultidisciplinarySubject/MultidisciplinarySubjectArticlePage';
// @ts-ignore
import App from './App';

import {
  FILM_PAGE_PATH,
  MULTIDISCIPLINARY_SUBJECT_PAGE_PATH,
  PLAIN_ARTICLE_PAGE_PATH,
  PLAIN_LEARNINGPATH_PAGE_PATH,
  PLAIN_LEARNINGPATHSTEP_PAGE_PATH,
  PROGRAMME_PAGE_PATH,
  PROGRAMME_PATH,
  RESOURCE_PAGE_PATH,
  SEARCH_PATH,
  SUBJECTS,
  SUBJECT_PAGE_PATH,
  MULTIDISCIPLINARY_SUBJECT_ARTICLE_PAGE_PATH,
} from './constants';

// @ts-ignore
import ProgrammePage from './containers/ProgrammePage/ProgrammePage';

export interface RouteType extends RouteProps {
  hideBreadcrumb?: boolean;
  hideMasthead?: boolean;
  background?: boolean;
}

export const routes: RouteType[] = [
  {
    path: '/',
    hideMasthead: true,
    exact: true,
    component: WelcomePage,
    background: false,
  },
  {
    path: RESOURCE_PAGE_PATH,
    component: ResourcePage,
    background: false,
  },
  {
    path: PLAIN_ARTICLE_PAGE_PATH,
    component: PlainArticlePage,
    background: false,
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
    background: false,
  },
  {
    path: FILM_PAGE_PATH.replace(':', '\\:'),
    exact: true,
    component: FilmFrontpage,
    background: false,
  },
  {
    path: MULTIDISCIPLINARY_SUBJECT_ARTICLE_PAGE_PATH,
    component: MultidisciplinarySubjectArticlePage,
    background: false,
  },
  {
    path: MULTIDISCIPLINARY_SUBJECT_PAGE_PATH,
    component: MultidisciplinarySubjectPage,
    background: false,
  },
  {
    path: SUBJECT_PAGE_PATH,
    component: SubjectPage,
    hideBreadcrumb: true,
    background: false,
  },
  {
    path: SUBJECTS,
    component: AllSubjectsPage,
    background: false,
  },
  {
    path: `${PROGRAMME_PAGE_PATH}${SUBJECT_PAGE_PATH}`,
    component: SubjectPage,
    hideBreadcrumb: true,
    background: false,
  },
  {
    path: PROGRAMME_PAGE_PATH,
    component: ProgrammePage,
    background: false,
  },
  {
    path: PROGRAMME_PATH,
    component: AllSubjectsPage,
    background: false,
  },
  {
    path: '/404',
    component: NotFoundPage,
    background: false,
  },
  {
    component: NotFoundPage,
    background: false,
  },
];

const routesFunc = function(initialProps = {}, locale: string) {
  return <App initialProps={initialProps} locale={locale} />;
};
export default routesFunc;
