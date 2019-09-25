/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import {
  Masthead,
  MastheadItem,
  LanguageSelector,
  Logo,
  DisplayOnPageYOffset,
  BreadcrumbBlock,
} from '@ndla/ui';
import { injectT } from '@ndla/i18n';
import { compose } from 'redux';
import { withApollo } from 'react-apollo';
import { getUrnIdsFromProps, toBreadcrumbItems } from '../../routeHelpers';
import { getTopicPath } from '../../util/getTopicPath';
import { LocationShape } from '../../shapes';
import MastheadSearch from './components/MastheadSearch';
import MastheadMenu from './components/MastheadMenu';
import {
  topicResourcesQuery,
  resourceTypesQuery,
  resourceQuery,
  subjectTopicsQuery,
} from '../../queries';
import { getResourceGroups } from '../Resources/getResourceGroups';
import { runQueries } from '../../util/runQueries';
import handleError from '../../util/handleError';
import { toTopicMenu } from '../../util/topicsHelper';
import {
  getFiltersFromUrl,
  getFiltersFromUrlAsArray,
} from '../../util/filterHelper';
import { getLocaleUrls } from '../../util/localeHelpers';
import ErrorBoundary from '../ErrorPage/ErrorBoundary';

class MastheadContainer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
    };
  }

  componentDidMount() {
    this.updateData();
  }

  componentDidUpdate(prevProps) {
    const { location } = this.props;
    if (
      location.pathname !== prevProps.location.pathname ||
      location.search !== prevProps.location.search
    ) {
      this.updateData();
    }
  }

  updateData = async () => {
    const { location } = this.props;
    const { subjectId, resourceId, topicId } = getUrnIdsFromProps(this.props);
    if (subjectId) {
      try {
        const activeFilters = getFiltersFromUrlAsArray(location);
        const data = await this.getData(
          subjectId,
          topicId,
          resourceId,
          activeFilters,
        );
        this.setState({
          data,
        });
      } catch (error) {
        handleError(error);
      }
    }
  };

  onDataFetch = async (subjectId, topicId, resourceId, filters = []) => {
    this.setState(prevState => ({
      data: {
        ...prevState.data,
        topicResourcesByType: [],
      },
    }));
    const data = await this.getData(subjectId, topicId, resourceId, filters);
    this.setState({ data });
  };

  getData = async (subjectId, topicId, resourceId, activeFilters = []) => {
    const filterIds = activeFilters.join(',');

    try {
      const queries = [];
      if (subjectId) {
        queries.push({ query: resourceTypesQuery });
        queries.push({
          query: subjectTopicsQuery,
          variables: { subjectId, filterIds },
        });
      }
      if (topicId) {
        queries.push({
          query: topicResourcesQuery,
          variables: { topicId, filterIds, subjectId },
        });
      }
      if (resourceId) {
        queries.push({
          query: resourceQuery,
          variables: { resourceId, filterIds, subjectId },
        });
      }

      const { data } = await runQueries(this.props.client, queries);
      const { resourceTypes, topic, subject } = data;
      const supplementaryResources =
        topic && topic.supplementaryResources
          ? topic.supplementaryResources
          : [];
      const coreResources =
        topic && topic.coreResources ? topic.coreResources : [];
      const topicResourcesByType = getResourceGroups(
        resourceTypes,
        supplementaryResources,
        coreResources,
      );
      const topicPath =
        subject && subject.topics
          ? getTopicPath(subjectId, topicId, subject.topics)
          : [];

      const filters =
        subject && subject.filters
          ? subject.filters.map(filter => ({
              ...filter,
              title: filter.name,
              value: filter.id,
            }))
          : [];

      const topicsWithSubTopics =
        subject && subject.topics
          ? subject.topics
              .filter(t => !t.parent || t.parent === subjectId)
              .map(t => toTopicMenu(t, subject.topics))
          : [];

      return {
        filters,
        resource: data.resource,
        topicResourcesByType,
        topicPath,
        subject: {
          ...subject,
          topics: topicsWithSubTopics,
        },
      };
    } catch (e) {
      handleError(e);
      return { error: true };
    }
  };

  render() {
    const {
      infoContent,
      locale,
      location,
      t,
      ndlaFilm,
      skipToMainContentId,
    } = this.props;
    const {
      data: { subject, topicPath, filters, topicResourcesByType, resource },
    } = this.state;

    const breadcrumbBlockItems = subject
      ? toBreadcrumbItems(
          t('breadcrumb.toFrontpage'),
          [subject, ...topicPath, resource],
          getFiltersFromUrl(location),
        )
      : [];

    const renderSearchComponent = hideOnNarrowScreen =>
      subject &&
      !location.pathname.includes('search') && (
        <MastheadSearch
          subject={subject}
          ndlaFilm={ndlaFilm}
          hideOnNarrowScreen={hideOnNarrowScreen}
        />
      );
    return (
      <ErrorBoundary>
        <Masthead
          showLoaderWhenNeeded={topicPath && topicPath.length > 0}
          fixed
          ndlaFilm={ndlaFilm}
          skipToMainContentId={skipToMainContentId}
          infoContent={infoContent}>
          <MastheadItem left>
            {subject && (
              <MastheadMenu
                subject={subject}
                ndlaFilm={ndlaFilm}
                searchFieldComponent={renderSearchComponent(false)}
                topicPath={topicPath || []}
                onDataFetch={this.onDataFetch}
                filters={filters}
                resource={resource}
                topicResourcesByType={topicResourcesByType || []}
                locale={locale}
              />
            )}
            <DisplayOnPageYOffset yOffsetMin={150}>
              <BreadcrumbBlock
                items={
                  breadcrumbBlockItems.length > 1
                    ? breadcrumbBlockItems.slice(1)
                    : []
                }
              />
            </DisplayOnPageYOffset>
          </MastheadItem>
          <MastheadItem right>
            <LanguageSelector
              inverted={ndlaFilm}
              options={getLocaleUrls(locale, location)}
              currentLanguage={locale}
            />
            {renderSearchComponent(true)}
            <Logo
              to="/"
              locale={locale}
              label={t('logo.altText')}
              cssModifier={ndlaFilm ? 'white' : ''}
            />
          </MastheadItem>
        </Masthead>
      </ErrorBoundary>
    );
  }
}

MastheadContainer.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      subjectId: PropTypes.string,
      topicId: PropTypes.string,
    }).isRequired,
  }).isRequired,
  location: LocationShape,
  client: PropTypes.shape({ query: PropTypes.func.isRequired }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  locale: PropTypes.string.isRequired,
  infoContent: PropTypes.node,
  ndlaFilm: PropTypes.bool,
  skipToMainContentId: PropTypes.string.isRequired,
};

export default compose(
  withApollo,
  injectT,
)(MastheadContainer);
