/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { useApolloClient } from '@apollo/client';

import { ResourceShape } from '../shapes';
import SearchInnerPage from '../containers/SearchPage/SearchInnerPage';
import ErrorPage from '../containers/ErrorPage/ErrorPage';
import handleError from '../util/handleError';
import { searchPageQuery } from '../queries';
import { LtiDataShape } from '../shapes';
import ErrorBoundary from '../containers/ErrorPage/ErrorBoundary';
import { useGraphQuery } from '../util/runQueries';
import { searchSubjects } from '../util/searchHelpers';
import { RESOURCE_TYPE_LEARNING_PATH } from '../constants';
import { initializeI18n } from '../i18n';

const LtiProvider = ({ locale: { abbreviation: locale }, ltiData }) => {
  const [searchParams, setSearchParams] = useState({
    query: '',
    subjects: [],
    programs: [],
    selectedFilters: [],
    activeSubFilters: [],
  });
  const { t, i18n } = useTranslation();
  const subjects = searchSubjects(searchParams.query);
  const subjectItems = subjects.map(subject => ({
    id: subject.id,
    title: subject.name,
    url: subject.path,
  }));

  const client = useApolloClient();

  useEffect(() => {
    initializeI18n(i18n, client);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { data, error, loading } = useGraphQuery(searchPageQuery);

  const handleSearchParamsChange = searchParamUpdates => {
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

  const allSubjects =
    data.subjects?.map(subject => ({
      title: subject.name,
      value: subject.id,
    })) || [];

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
        subjects={searchParams.subjects}
        programmes={searchParams.programs}
        selectedFilters={searchParams.selectedFilters}
        activeSubFilters={searchParams.activeSubFilters}
        allSubjects={allSubjects}
        subjectItems={subjectItems}
        resourceTypes={data.resourceTypes.filter(
          type => type.id !== RESOURCE_TYPE_LEARNING_PATH,
        )}
        ltiData={ltiData}
        isLti
        locale={locale}
      />
    </ErrorBoundary>
  );
};

LtiProvider.propTypes = {
  locale: PropTypes.object.isRequired,
  resource: ResourceShape,
  ltiData: LtiDataShape,
};

export default LtiProvider;
