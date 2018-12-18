/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { injectT } from '@ndla/i18n';
import { withApollo, Query } from 'react-apollo';
import { ArticleShape, ResourceTypeShape } from '../shapes';
import SearchContainer from '../containers/SearchPage/SearchContainer';
import { resultsWithContentTypeBadgeAndImage } from '../containers/SearchPage/searchHelpers';
import ErrorPage from '../containers/ErrorPage/ErrorPage';
import handleError from '../util/handleError';
import LtiSearchResultList from './LtiSearchResultList';
import { RESOURCE_TYPE_LEARNING_PATH } from '../constants';
import {
  resourceTypesWithSubTypesQuery,
  subjectsWithFiltersQuery,
} from '../queries';
import { sortResourceTypes } from '../containers/Resources/getResourceGroups';

class LtiProvider extends React.Component {
  constructor(props) {
    super(props);
    this.location = null;
    this.state = {
      hasError: false,
      searchObject: {
        contextFilters: [],
        languageFilter: [],
        resourceTypes: undefined,
        contextTypes: undefined,
        levels: [],
        subjects: [],
        page: '1',
      },
    };
    this.onSearchObjectChange = this.onSearchObjectChange.bind(this);
    this.getResultComponent = this.getResultComponent.bind(this);
    this.getSearchObject = this.getSearchObject.bind(this);
    this.getEnabledTabs = this.getEnabledTabs.bind(this);
  }

  onSearchObjectChange(updatedFields) {
    this.setState(prevState => ({
      searchObject: {
        ...prevState.searchObject,
        ...updatedFields,
        page: updatedFields.page
          ? updatedFields.page.toString()
          : prevState.searchObject.page,
      },
    }));
  }

  getResultComponent(results, enabledTab) {
    const { t, ltiData } = this.props;
    return (
      <LtiSearchResultList
        messages={{
          subjectsLabel: t('searchPage.searchResultListMessages.subjectsLabel'),
          noResultHeading: t(
            'searchPage.searchResultListMessages.noResultHeading',
          ),
          noResultDescription: t(
            'searchPage.searchResultListMessages.noResultDescription',
          ),
        }}
        ltiData={ltiData}
        results={
          results && resultsWithContentTypeBadgeAndImage(results, t, enabledTab)
        }
      />
    );
  }

  getSearchObject(filtredResourceTypes) {
    const { searchObject } = this.state;
    const { contextTypes, resourceTypes } = searchObject;
    let searchObjectResourceTypes = filtredResourceTypes.map(type => type.id);
    if (contextTypes) {
      searchObjectResourceTypes = undefined;
    } else if (resourceTypes && resourceTypes.length !== 0) {
      searchObjectResourceTypes = resourceTypes;
    }

    return {
      ...searchObject,
      resourceTypes: searchObjectResourceTypes,
    };
  }

  getEnabledTabs(resourceTypes = []) {
    const { t } = this.props;
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
  }

  componentDidCatch(error, info) {
    if (process.env.NODE_ENV === 'production') {
      // React prints all errors that occurred during rendering to the console in development
      handleError(error, info);
    }
    this.setState({ hasError: true });
  }

  render() {
    const {
      locale: { abbreviation: locale },
    } = this.props;
    const { hasError } = this.state;

    if (hasError) {
      return <ErrorPage locale={locale} />;
    }

    return (
      <Fragment>
        <Helmet htmlAttributes={{ lang: locale }} />
        <Query
          asyncMode
          query={resourceTypesWithSubTypesQuery}
          fetchPolicy="no-cache"
          ssr={false}>
          {resourceTypesResult => {
            const {
              error: resourceTypesError,
              data: resourceTypesData,
            } = resourceTypesResult;
            if (resourceTypesError) {
              handleError(resourceTypesError);
              return <ErrorPage locale={locale} />;
            }
            return (
              <Query
                asyncMode
                query={subjectsWithFiltersQuery}
                fetchPolicy="no-cache"
                ssr={false}>
                {subjectsResult => {
                  const {
                    error: subjectsError,
                    data: subjectsData,
                  } = subjectsResult;
                  if (subjectsError) {
                    handleError(subjectsError);
                    return <ErrorPage locale={locale} />;
                  }

                  const loading =
                    subjectsResult.loading || resourceTypesResult.loading;

                  const filtredResourceTypes = resourceTypesData.resourceTypes
                    ? resourceTypesData.resourceTypes.filter(
                        type => type.id !== RESOURCE_TYPE_LEARNING_PATH,
                      )
                    : [];

                  return (
                    <SearchContainer
                      data={{
                        resourceTypes: filtredResourceTypes,
                        subjects: subjectsData.subjects,
                      }}
                      locale={locale}
                      loading={loading || false}
                      searchObject={this.getSearchObject(filtredResourceTypes)}
                      enabledTabs={this.getEnabledTabs(filtredResourceTypes)}
                      allTabValue={filtredResourceTypes
                        .map(type => type.id)
                        .join(',')}
                      handleSearchParamsChange={this.onSearchObjectChange}
                      customResultList={this.getResultComponent}
                    />
                  );
                }}
              </Query>
            );
          }}
        </Query>
      </Fragment>
    );
  }
}

LtiProvider.propTypes = {
  locale: PropTypes.shape({
    abbreviation: PropTypes.string.isRequired,
    messages: PropTypes.object.isRequired,
  }).isRequired,
  resource: PropTypes.shape({
    article: ArticleShape,
    resourceTypes: PropTypes.arrayOf(ResourceTypeShape),
  }),
  ltiData: PropTypes.shape({
    launch_presentation_return_url: PropTypes.string,
    launch_presentation_document_target: PropTypes.string,
  }),
};

export default injectT(withApollo(LtiProvider));
