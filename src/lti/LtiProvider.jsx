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
import { withTracker } from '@ndla/tracker';
import { withApollo, Query } from 'react-apollo';
import { getAllDimensions } from '../util/trackingUtil';
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

class LtiProvider extends React.Component {
  constructor(props) {
    super(props);
    this.location = null;
    this.state = {
      hasError: false,
      searchParams: {
        contextFilters: [],
        languageFilter: [],
        resourceTypes: undefined,
        contextTypes: undefined,
        levels: [],
        subjects: [],
        page: '1',
      },
    };
    this.onSearchParamsChange = this.onSearchParamsChange.bind(this);
    this.getSearchParams = this.getSearchParams.bind(this);
    this.getEnabledTabs = this.getEnabledTabs.bind(this);
  }

  static willTrackPageView(trackPageView, currentProps) {
    trackPageView(currentProps);
  }

  static getDocumentTitle({ t }) {
    return `LTI${t('htmlTitles.titleTemplate')}`;
  }

  static getDimensions(props) {
    return getAllDimensions(props, undefined, true);
  }

  onSearchParamsChange(updatedFields) {
    this.setState(prevState => ({
      searchParams: {
        ...prevState.searchParams,
        ...updatedFields,
        page: updatedFields.page
          ? updatedFields.page.toString()
          : prevState.searchParams.page,
      },
    }));
  }

  getSearchParams(filtredResourceTypes) {
    const { searchParams } = this.state;
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
      ltiData,
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
                  if (loading) {
                    return null;
                  }
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
                      searchParams={this.getSearchParams(filtredResourceTypes)}
                      enabledTabs={this.getEnabledTabs(filtredResourceTypes)}
                      allTabValue={filtredResourceTypes
                        .map(type => type.id)
                        .join(',')}
                      handleSearchParamsChange={this.onSearchParamsChange}
                      ltiData={ltiData}
                      includeEmbedButton
                      isLti
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
  ltiData: LtiDataShape,
};

export default injectT(withTracker(withApollo(LtiProvider)));
