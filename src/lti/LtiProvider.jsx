/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { injectT } from '@ndla/i18n';
import { useQuery } from 'react-apollo';
import { ArticleShape, ResourceTypeShape } from '../shapes';
import SearchContainer from '../containers/SearchPage/SearchContainer';
import ErrorPage from '../containers/ErrorPage/ErrorPage';
import handleError from '../util/handleError';
import { RESOURCE_TYPE_LEARNING_PATH } from '../constants';
import {
  resourceTypesWithSubTypesQuery,
  subjectsWithFiltersQuery,
} from '../queries';
import { sortResourceTypes } from '../containers/Resources/getResourceGroups';
import { LtiDataShape } from '../shapes';
import ErrorBoundary from '../containers/ErrorPage/ErrorBoundary';

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

  const {
    loading: resourceLoading,
    data: resourceTypesData,
    error: resourceTypesError,
  } = useQuery(resourceTypesWithSubTypesQuery, { fetchPolicy: 'no-cache' });
  const {
    loading: subjectsLoading,
    data: subjectsData,
    error: subjectsError,
  } = useQuery(subjectsWithFiltersQuery);

  if (resourceLoading || subjectsLoading) return null;

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
    const { contextTypes, resourceTypes } = searchParams;
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
        name: t('contentTypes.subject'),
      },
      ...resourceTypeTabs,
    ];
  };

  const error = resourceTypesError || subjectsError;
  if (error) {
    handleError(error);
    return <ErrorPage locale={locale} />;
  }

  const filtredResourceTypes = resourceTypesData.resourceTypes
    ? resourceTypesData.resourceTypes.filter(
        type => type.id !== RESOURCE_TYPE_LEARNING_PATH,
      )
    : [];

  return (
    <ErrorBoundary>
      <Helmet htmlAttributes={{ lang: locale }} />
      <SearchContainer
        data={{
          resourceTypes: filtredResourceTypes,
          subjects: subjectsData.subjects,
        }}
        locale={locale}
        searchParams={getSearchParams(filtredResourceTypes)}
        enabledTabs={getEnabledTabs(filtredResourceTypes)}
        allTabValue={filtredResourceTypes.map(type => type.id).join(',')}
        handleSearchParamsChange={onSearchParamsChange}
        ltiData={ltiData}
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
  resource: PropTypes.shape({
    article: ArticleShape,
    resourceTypes: PropTypes.arrayOf(ResourceTypeShape),
  }),
  ltiData: LtiDataShape,
};

export default injectT(LtiProvider);
