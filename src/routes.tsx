/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { RouteProps } from 'react-router';
import { ApolloClient } from '@apollo/client';
import { I18nextProvider } from 'react-i18next';
import { i18nInstance } from '@ndla/ui';
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
import PodcastPage from './containers/PodcastPage/PodcastPage';
import PodcastListPage from './containers/PodcastPage/PodcastListPage';
import ToolboxSubjectPage from './containers/ToolboxSubject/ToolboxSubjectPage';
// @ts-ignore
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
  PODCAST_PAGE_PATH,
  PODCAST_LIST_PAGE_PATH,
  TOOLBOX_TEACHER_PAGE_PATH,
  TOOLBOX_STUDENT_PAGE_PATH,
} from './constants';
import ProgrammePage from './containers/ProgrammePage/ProgrammePage';
import { InitialProps, LocaleType } from './interfaces';
import ErrorBoundary from './containers/ErrorPage/ErrorBoundary';
import { I18nWrapper } from './I18nWrapper';
import config from './config';
import AccessDeniedPage from './containers/AccessDeniedPage/AccessDeniedPage';

export interface RootComponentProps {
  locale: LocaleType;
  ndlaFilm?: boolean;
  skipToContentId: string;
}

export interface RouteType extends RouteProps {
  hideBreadcrumb?: boolean;
  hideMasthead?: boolean;
  background?: boolean;
  initialSelectMenu?: string;
  component: React.ComponentType<RootComponentProps>;
}

let routeArray: RouteType[] = [
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
    initialSelectMenu: 'programmes',
  },
  {
    path: PLAIN_LEARNINGPATHSTEP_PAGE_PATH,
    component: PlainLearningpathPage,
    background: false,
    initialSelectMenu: 'programmes',
  },
  {
    path: PLAIN_LEARNINGPATH_PAGE_PATH,
    component: PlainLearningpathPage,
    background: true,
    initialSelectMenu: 'programmes',
  },
  {
    path: SEARCH_PATH,
    component: SearchPage,
    background: false,
    initialSelectMenu: 'programmes',
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
    path: TOOLBOX_TEACHER_PAGE_PATH,
    component: ToolboxSubjectPage,
    background: false,
  },
  {
    path: TOOLBOX_STUDENT_PAGE_PATH,
    component: ToolboxSubjectPage,
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
    path: PODCAST_PAGE_PATH,
    component: PodcastPage,
    background: false,
  },
  {
    path: PODCAST_LIST_PAGE_PATH,
    component: PodcastListPage,
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
    initialSelectMenu: 'programme',
  },
  {
    path: PROGRAMME_PATH,
    component: AllSubjectsPage,
    background: false,
  },
];

if (config.feideEnabled) {
  routeArray.push(
    {
      path: '/login',
      //@ts-ignore
      component: Login,
      background: false,
    },
    {
      path: '/logout',
      component: Logout,
      background: false,
    },
  );
}

// Hvis 404 eller notfound kommer før vil man ikke kunne finne endepunktene under.
routeArray.push(
  {
    path: '/403',
    component: AccessDeniedPage,
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
);

export const routes = routeArray;

const routesFunc = function(
  initialProps: InitialProps,
  client: ApolloClient<object>,
  locale?: LocaleType,
  isClient = false,
) {
  if (!isClient) {
    i18nInstance.changeLanguage(locale);
  }
  const app = (
    <App
      initialProps={initialProps}
      isClient={isClient}
      client={client}
      locale={locale}
      key={locale}
    />
  );

  return (
    <ErrorBoundary>
      <I18nextProvider i18n={i18nInstance}>
        {isClient ? (
          <I18nWrapper locale={locale} initialProps={initialProps} />
        ) : (
          app
        )}
      </I18nextProvider>
    </ErrorBoundary>
  );
};
export default routesFunc;
