/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useApolloClient } from '@apollo/client';
import { setCookie } from '@ndla/util';

import SearchInnerPage from '../containers/SearchPage/SearchInnerPage';
import ErrorPage from '../containers/ErrorPage/ErrorPage';
import handleError from '../util/handleError';
import { searchPageQuery } from '../queries';
import ErrorBoundary from '../containers/ErrorPage/ErrorBoundary';
import { useGraphQuery } from '../util/runQueries';
import { searchSubjects } from '../util/searchHelpers';
import {
  RESOURCE_TYPE_LEARNING_PATH,
  STORED_LANGUAGE_COOKIE_KEY,
} from '../constants';
import { LtiData } from '../interfaces';
import { GQLSearchPageQuery } from '../graphqlTypes';
import { createApolloLinks } from '../util/apiHelpers';

interface Props {
  ltiData?: LtiData;
}

interface SearchParams {
  query?: string;
  subjects: string[];
  programs: string[];
  selectedFilters: string[];
  activeSubFilters: string[];
}
const LtiProvider = ({ ltiData }: Props) => {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    query: '',
    subjects: [],
    programs: [],
    selectedFilters: [],
    activeSubFilters: [],
  });
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const subjects = searchSubjects(searchParams.query);
  const subjectItems = subjects.map(subject => ({
    id: subject.id,
    title: subject.name,
    url: subject.path,
  }));

  const { data, error, loading } = useGraphQuery<GQLSearchPageQuery>(
    searchPageQuery,
  );
  const client = useApolloClient();

  i18n.on('languageChanged', lang => {
    client.resetStore();
    client.setLink(createApolloLinks(lang));
    setCookie({ cookieName: STORED_LANGUAGE_COOKIE_KEY, cookieValue: lang });
    document.documentElement.lang = lang;
  });

  const handleSearchParamsChange = (searchParamUpdates: {
    selectedFilters?: string;
  }) => {
    const selectedFilters =
      searchParamUpdates.selectedFilters?.split(',') ?? [];
    setSearchParams(prevState => ({
      ...prevState,
      ...searchParamUpdates,
      selectedFilters,
    }));
  };

  if (loading) {
    return null;
  }

  if (error && !data) {
    handleError(error);
    return <ErrorPage />;
  }

  return (
    <ErrorBoundary>
      <Helmet htmlAttributes={{ lang: locale }}>
        <title>{`${t('htmlTitles.lti')}`}</title>
      </Helmet>
      <SearchInnerPage
        handleSearchParamsChange={handleSearchParamsChange}
        query={searchParams.query}
        subjects={searchParams.subjects}
        programmes={searchParams.programs}
        selectedFilters={searchParams.selectedFilters}
        activeSubFilters={searchParams.activeSubFilters}
        subjectItems={subjectItems}
        resourceTypes={data?.resourceTypes?.filter(
          type => type.id !== RESOURCE_TYPE_LEARNING_PATH,
        )}
        ltiData={ltiData}
        isLti
      />
    </ErrorBoundary>
  );
};

export default LtiProvider;
