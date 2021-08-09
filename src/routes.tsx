/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import loadable from '@loadable/component';
import { RouteProps } from 'react-router';
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
import ProgrammePage from './containers/ProgrammePage/ProgrammePage';
import { InitialProps, LocaleType } from './interfaces';
const ResourcePage = loadable(() =>
  import('./containers/ResourcePage/ResourcePage'),
);

const MultidisciplinarySubjectPage = loadable(() =>
  import('./containers/MultidisciplinarySubject/MultidisciplinarySubjectPage'),
);
const MultidisciplinarySubjectArticlePage = loadable(() =>
  import(
    './containers/MultidisciplinarySubject/MultidisciplinarySubjectArticlePage'
  ),
);
const WelcomePage = loadable(() =>
  import('./containers/WelcomePage/WelcomePage'),
);
const PlainArticlePage = loadable(() =>
  import('./containers/PlainArticlePage/PlainArticlePage'),
);

const SearchPage = loadable(() => import('./containers/SearchPage/SearchPage'));
const AllSubjectsPage = loadable(() =>
  import('./containers/AllSubjectsPage/AllSubjectsPage'),
);
const SubjectPage = loadable(() =>
  import('./containers/SubjectPage/SubjectPage'),
);
const NotFoundPage = loadable(() =>
  import('./containers/NotFoundPage/NotFoundPage'),
);
const FilmFrontpage = loadable(() =>
  import('./containers/FilmFrontpage/NdlaFilmFrontpage'),
);
const PlainLearningpathPage = loadable(() =>
  import('./containers/PlainLearningpathPage/PlainLearningpathPage'),
);

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
    component: NotFoundPage,
    background: false,
  },
];

const routesFunc = function(initialProps: InitialProps, locale: LocaleType) {
  return <App initialProps={initialProps} locale={locale} />;
};
export default routesFunc;
