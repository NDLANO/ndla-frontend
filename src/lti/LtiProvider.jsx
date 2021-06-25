/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { injectT } from '@ndla/i18n';

import { ResourceShape } from '../shapes';
import SearchInnerPage from '../containers/SearchPage/SearchInnerPage';
import ErrorPage from '../containers/ErrorPage/ErrorPage';
import handleError from '../util/handleError';
import { searchPageQuery, conceptSearchQuery } from '../queries';
import { LtiDataShape } from '../shapes';
import ErrorBoundary from '../containers/ErrorPage/ErrorBoundary';
import { useGraphQuery } from '../util/runQueries';
import { searchSubjects } from '../util/searchHelpers';
import { RESOURCE_TYPE_LEARNING_PATH } from '../constants';

const LtiProvider = ({ t, locale: { abbreviation: locale }, ltiData }) => {
  const [searchParams, setSearchParams] = useState({
    query: '',
    subjects: [],
    programs: [],
  });
  const subjects = searchSubjects(searchParams.query);
  const subjectItems = subjects.map(subject => ({
    id: subject.id,
    title: subject.name,
    url: subject.path,
  }));

  const { data, error, loading } = useGraphQuery(searchPageQuery);
  const { data: conceptData } = useGraphQuery(conceptSearchQuery, {
    skip: !searchParams.query,
    variables: {
      query: searchParams.query,
    },
  });

  const handleSearchParamsChange = searchParamUpdates => {
    setSearchParams(prevState => ({
      ...prevState,
      ...searchParamUpdates,
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
        allSubjects={allSubjects}
        subjectItems={subjectItems}
        concepts={conceptData?.conceptSearch}
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
  locale: PropTypes.shape({
    abbreviation: PropTypes.string.isRequired,
    messages: PropTypes.object.isRequired,
  }).isRequired,
  resource: ResourceShape,
  ltiData: LtiDataShape,
};

export default injectT(LtiProvider);
