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
import SearchContainer from '../containers/SearchPage/SearchContainer';
import ErrorPage from '../containers/ErrorPage/ErrorPage';
import handleError from '../util/handleError';
import {
  RESOURCE_TYPE_LEARNING_PATH,
  RESOURCE_TYPE_SUBJECT_MATERIAL,
  RESOURCE_TYPE_TASKS_AND_ACTIVITIES,
  RESOURCE_TYPE_ASSESSMENT_RESOURCES,
  RESOURCE_TYPE_SOURCE_MATERIAL,
  RESOURCE_TYPE_EXTERNAL_LEARNING_RESOURCES,
} from '../constants';
import { searchPageQuery, searchQuery } from '../queries';
import { sortResourceTypes } from '../containers/Resources/getResourceGroups';
import { LtiDataShape } from '../shapes';
import ErrorBoundary from '../containers/ErrorPage/ErrorBoundary';
import { useGraphQuery } from '../util/runQueries';
import { convertSearchParam } from '../containers/SearchPage/searchHelpers';

const LtiProvider = ({ t, locale: { abbreviation: locale }, ltiData }) => {
  const [searchParams, setSearchParams] = useState({
    contextFilters: [],
    languageFilter: [],
    resourceTypes: undefined,
    contextTypes: undefined,
    levels: [],
    subjects: [],
    page: '1',
  });

  const filteredSearchParams = {
    ...searchParams,
    resourceTypes: searchParams.contextTypes
      ? undefined
      : searchParams.resourceTypes ||
        `${RESOURCE_TYPE_SUBJECT_MATERIAL},${RESOURCE_TYPE_TASKS_AND_ACTIVITIES},${RESOURCE_TYPE_ASSESSMENT_RESOURCES},${RESOURCE_TYPE_SOURCE_MATERIAL},${RESOURCE_TYPE_EXTERNAL_LEARNING_RESOURCES}`,
  };

  const stateSearchParams = {};
  Object.keys(filteredSearchParams).forEach(key => {
    stateSearchParams[key] = convertSearchParam(filteredSearchParams[key]);
  });

  const { loading, data, error } = useGraphQuery(searchPageQuery);

  const { data: searchData, loadingSearch, searchError } = useGraphQuery(
    searchQuery,
    {
      variables: stateSearchParams,
    },
  );

  if (loading) return null;

  const onSearchParamsChange = updatedFields => {
    setSearchParams({
      ...searchParams,
      ...updatedFields,
      page: updatedFields.page
        ? updatedFields.page.toString()
        : searchParams.page,
    });
  };

  const getSearchParams = filtredResourceTypes => {
    const { contextTypes, resourceTypes } = filteredSearchParams;
    let searchParamsResourceTypes = filtredResourceTypes.map(type => type.id);
    if (contextTypes) {
      searchParamsResourceTypes = undefined;
    } else if (resourceTypes && resourceTypes.length !== 0) {
      searchParamsResourceTypes = resourceTypes;
    }

    return {
      ...searchParams,
      resourceTypes: searchParamsResourceTypes,
    };
  };

  const getEnabledTabs = (resourceTypes = []) => {
    const resourceTypeTabs = sortResourceTypes(resourceTypes).map(
      resourceType => ({
        value: resourceType.id,
        type: 'resourceTypes',
        name: resourceType.name,
      }),
    );

    return [
      {
        value: resourceTypes.map(type => type.id).join(','),
        name: t('contentTypes.all'),
      },
      {
        value: 'topic-article',
        type: 'contextTypes',
        name: t('contentTypes.topic'),
      },
      ...resourceTypeTabs,
    ];
  };

  if (error && !data) {
    handleError(error);
    return <ErrorPage locale={locale} />;
  }

  const filtredResourceTypes = data.resourceTypes
    ? data.resourceTypes.filter(type => type.id !== RESOURCE_TYPE_LEARNING_PATH)
    : [];

  const allTabValue = filtredResourceTypes.map(type => type.id).join(',');
  const enabledTab =
    stateSearchParams.resourceTypes ||
    stateSearchParams.contextTypes ||
    allTabValue;

  return (
    <ErrorBoundary>
      <Helmet htmlAttributes={{ lang: locale }}>
        <title>{`${t('htmlTitles.lti')}`}</title>
      </Helmet>
      <SearchContainer
        data={{
          resourceTypes: filtredResourceTypes,
          subjects: data.subjects,
        }}
        locale={locale}
        searchParams={getSearchParams(filtredResourceTypes)}
        enabledTabs={getEnabledTabs(filtredResourceTypes)}
        enabledTab={enabledTab}
        allTabValue={allTabValue}
        handleSearchParamsChange={onSearchParamsChange}
        error={searchError}
        ltiData={ltiData}
        loading={loadingSearch}
        searchData={searchData}
        includeEmbedButton
        isLti
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
