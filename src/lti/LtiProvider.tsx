/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { useApolloClient } from '@apollo/client';

import SearchInnerPage from '../containers/SearchPage/SearchInnerPage';
import ErrorPage from '../containers/ErrorPage/ErrorPage';
import handleError from '../util/handleError';
import { searchPageQuery } from '../queries';
import ErrorBoundary from '../containers/ErrorPage/ErrorBoundary';
import { useGraphQuery } from '../util/runQueries';
import { searchSubjects } from '../util/searchHelpers';
import { RESOURCE_TYPE_LEARNING_PATH } from '../constants';
import { initializeI18n } from '../i18n';
import { LocaleType, LtiData } from '../interfaces';
import { GQLSearchPageQuery } from '../graphqlTypes';

interface Props {
  locale?: LocaleType;
  ltiData?: LtiData;
}

interface SearchParams {
  query?: string;
  subjects: string[];
  programs: string[];
  selectedFilters: string[];
  activeSubFilters: string[];
}
const LtiProvider = ({ locale: propsLocale, ltiData }: Props) => {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    query: '',
    subjects: [],
    programs: [],
    selectedFilters: [],
    activeSubFilters: [],
  });
  const { t, i18n } = useTranslation();
  const locale = propsLocale ?? i18n.language;
  const subjects = searchSubjects(searchParams.query);
  const subjectItems = subjects?.map(subject => ({
    id: subject.id,
    title: subject.name,
    url: subject.path,
  }));

  const client = useApolloClient();

  useEffect(() => {
    initializeI18n(i18n, client);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { data, error, loading } = useGraphQuery<GQLSearchPageQuery>(
    searchPageQuery,
  );

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
    return <ErrorPage locale={locale} />;
  }

  return (
    <ErrorBoundary>
      <Helmet htmlAttributes={{ lang: locale }}>
        <title>{`${t('htmlTitles.lti')}`}</title>
      </Helmet>
      <SearchInnerPage
        handleSearchParamsChange={handleSearchParamsChange}
        query={searchParams.query}
        subjectIds={searchParams.subjects}
        programmeNames={searchParams.programs}
        selectedFilters={searchParams.selectedFilters}
        activeSubFilters={searchParams.activeSubFilters}
        subjects={data?.subjects}
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
