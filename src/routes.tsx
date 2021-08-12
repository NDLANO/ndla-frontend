/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { RouteProps, useHistory } from 'react-router';
import { ApolloClient } from '@apollo/client';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { i18nInstance } from '@ndla/ui';
import { BrowserRouter } from 'react-router-dom';
import { useEffect } from 'react';
import { useState } from 'react';
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
import ErrorBoundary from './containers/ErrorPage/ErrorBoundary';
import { useRef } from 'react';

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

const TestF = ({
  children,
  locale,
}: {
  children?: React.ReactNode;
  locale?: LocaleType;
}) => {
  console.log('loc', locale);
  const { i18n } = useTranslation();
  const history = useHistory();
  const [lang, setLang] = useState(locale);
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    //@ts-ignore
    const supLangs: string[] = i18n.options.supportedLngs!;
    const regex = new RegExp(supLangs.map(l => `/${l}/`).join('|'));
    const paths = window.location.pathname.replace(regex, '').split('/');
    const { search } = window.location;
    const p = paths.slice().join('/');
    const test = p.startsWith('/') ? p : `/${p}`;
    history.replace(`/${i18n.language}${test}${search}`);
    //@ts-ignore
    setLang(i18n.language);
  }, [i18n.language]);

  return (
    <BrowserRouter basename={lang} key={lang}>
      {children}
    </BrowserRouter>
  );
};

const routesFunc = function(
  initialProps: InitialProps,
  client: ApolloClient<object>,
  locale?: LocaleType,
  isClient = false,
) {
  if (isClient) {
  }
  return (
    <ErrorBoundary>
      {/* @ts-ignore I18nextprovider refuses to accept i18nInstance for some reason. It works, however. */}
      <I18nextProvider i18n={i18nInstance}>
        {isClient ? (
          <TestF
            children={
              <App
                initialProps={initialProps}
                client={client}
                locale={locale}
              />
            }
            locale={locale}
          />
        ) : (
          <App
            initialProps={initialProps}
            client={client}
            locale={locale}
            key={locale}
          />
        )}
      </I18nextProvider>
    </ErrorBoundary>
  );
};
export default routesFunc;
