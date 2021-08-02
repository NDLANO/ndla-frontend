/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { RouteProps } from 'react-router';
import WelcomePage from './containers/WelcomePage/WelcomePage';
import PlainArticlePage from './containers/PlainArticlePage/PlainArticlePage';
import SearchPage from './containers/SearchPage/SearchPage';
import AllSubjectsPage from './containers/AllSubjectsPage/AllSubjectsPage';
import SubjectPage from './containers/SubjectPage/SubjectPage';
import NotFoundPage from './containers/NotFoundPage/NotFoundPage';
import FilmFrontpage from './containers/FilmFrontpage/NdlaFilmFrontpage';
import PlainLearningpathPage from './containers/PlainLearningpathPage/PlainLearningpathPage';
import ResourcePage from './containers/ResourcePage/ResourcePage';
import MultidisciplinarySubjectPage from './containers/MultidisciplinarySubject/MultidisciplinarySubjectPage';
import MultidisciplinarySubjectArticlePage from './containers/MultidisciplinarySubject/MultidisciplinarySubjectArticlePage';
import App from './App';
import Login from './containers/Login/Login';
import Logout from './containers/Logout/Logout';

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
import ProgrammePage from './containers/ProgrammePage/ProgrammePage';
import { InitialProps, LocaleType } from './interfaces';

export interface RootComponentProps {
  locale: LocaleType;
  ndlaFilm?: boolean;
  skipToContentId: string;
}

export interface RouteType extends RouteProps {
  hideBreadcrumb?: boolean;
  hideMasthead?: boolean;
  background?: boolean;
  component: React.ComponentType<RootComponentProps>;
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
    path: '/login',
    component: Login,
    background: false,
  },
  {
    path: '/logout',
    component: Logout,
    background: false,
  },
  {
    component: NotFoundPage,
    background: false,
  },
];

const routesFunc = function(initialProps: InitialProps, locale: LocaleType) {
  return <App initialProps={initialProps} locale={locale} />;
};
export default routesFunc;
