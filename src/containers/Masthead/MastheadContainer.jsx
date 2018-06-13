/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Masthead, MastheadItem, Logo } from 'ndla-ui';
import Link from 'react-router-dom/Link';
import { injectT } from 'ndla-i18n';
import { connect } from 'react-redux';
import { compose } from 'redux';
import queryString from 'query-string';
import { withApollo } from 'react-apollo';
import { getUrnIdsFromProps } from '../../routeHelpers';
import { getTopicPath } from '../../util/getTopicPath';
import { LocationShape } from '../../shapes';
import { getGroupResults } from '../SearchPage/searchSelectors';
import * as searchActions from '../SearchPage/searchActions';
import { contentTypeMapping } from '../../util/getContentTypeFromResourceTypes';
import SearchButtonView from './SearchButtonView';
import MenuView from './MenuView';
import {
  topicResourcesQuery,
  resourceTypesQuery,
  resourceQuery,
  subjectQuery,
} from '../../queries';
import { getResourceGroups } from '../Resources/getResourceGroups';
import { runQueries } from '../../util/runQueries';
import handleError from '../../util/handleError';
import { toTopicMenu } from '../../util/topicsHelper';
import { getFiltersFromUrl } from '../../util/filterHelper';

export function getSelectedTopic(topics) {
  return [...topics] // prevent reverse mutation.
    .reverse()
    .find(topicId => topicId !== undefined && topicId !== null);
}

class MastheadContainer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      query: '',
      searchFieldFilters: [],
      searchIsOpen: false,
      expandedTopicIds: [],
      data: {},
    };
  }

  async componentDidMount() {
    const { location } = this.props;
    const { subjectId, resourceId, topicId } = getUrnIdsFromProps(this.props);

    if (subjectId) {
      const data = await this.getData(subjectId, topicId, resourceId, location);
      const expandedTopicIds = data.topicPath
        ? data.topicPath.map(topic => topic.id)
        : [];

      this.setState({
        data,
        expandedTopicIds,
        searchFieldFilters: data.subject
          ? [{ title: data.subject.name, value: data.subject.id }]
          : [],
      });
    }
  }

  async componentWillReceiveProps(nextProps) {
    const { location } = nextProps;
    if (
      location.pathname !== this.props.location.pathname ||
      location.search !== this.props.location.search
    ) {
      const { subjectId, resourceId, topicId } = getUrnIdsFromProps(nextProps);
      if (subjectId) {
        const data = await this.getData(
          subjectId,
          topicId,
          resourceId,
          location,
        );
        this.setState({
          data,
          expandedTopicIds: data.topicPath.map(topic => topic.id),
        });
      }
    }
  }

  onNavigate = async (...expandedTopicIds) => {
    const { location } = this.props;
    const { subjectId, resourceId } = getUrnIdsFromProps(this.props);
    this.setState(previusState => ({
      expandedTopicIds,
      data: {
        ...previusState.data,
        topicResourcesByType: [],
      },
    }));
    const selectedTopicId = getSelectedTopic(expandedTopicIds);
    if (selectedTopicId) {
      const data = await this.getData(
        subjectId,
        selectedTopicId,
        resourceId,
        location,
      );
      this.setState({ data });
    }
  };

  onFilterRemove = () => {
    this.setState({ searchFieldFilters: [] });
  };

  onQueryChange = query => {
    this.setState({ query }, this.executeSearch(query));
  };

  onSearch = evt => {
    evt.preventDefault();

    const { history } = this.props;
    const { query, data: { subject } } = this.state;
    this.executeSearch(query);
    history.push({
      pathname: '/search',
      search: `?${queryString.stringify({
        query: query.length > 0 ? query : undefined,
        subjects: subject ? subject.id : undefined,
      })}`,
    });
  };

  getData = async (subjectId, topicId, resourceId, location) => {
    const filterIds = getFiltersFromUrl(location);
    try {
      const queries = [];
      if (subjectId) {
        queries.push({ query: resourceTypesQuery });
        queries.push({
          query: subjectQuery,
          variables: { subjectId, filterIds },
        });
      }
      if (topicId) {
        queries.push({
          query: topicResourcesQuery,
          variables: { topicId, filterIds },
        });
      }
      if (resourceId) {
        queries.push({
          query: resourceQuery,
          variables: { resourceId },
        });
      }

      const { data } = await runQueries(this.props.client, queries);
      const { resourceTypes, topic, subject } = data;
      const coreResources =
        topic && topic.coreResources ? topic.coreResources : [];
      const topicResourcesByType = getResourceGroups(
        resourceTypes,
        [],
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

  executeSearch = query => {
    const { groupSearch } = this.props;
    const { searchFieldFilters } = this.state;

    const searchParams = {
      query,
      subjects:
        searchFieldFilters.length > 0
          ? searchFieldFilters.map(filter => filter.value).join(',')
          : undefined,
      'resource-types':
        'urn:resourcetype:learningPath,urn:resourcetype:subjectMaterial,urn:resourcetype:tasksAndActivities',
    };
    groupSearch(`?${queryString.stringify(searchParams)}`);
  };

  filterClick = newValues => {
    const { history } = this.props;
    const searchString = `?${queryString.stringify({
      filters: newValues.join(','),
    })}`;
    history.push(
      newValues.length > 0
        ? {
            search: searchString,
          }
        : {},
    );
  };

  render() {
    const { t, results, location } = this.props;
    const {
      data: { subject, topicPath, filters, topicResourcesByType, resource },
      expandedTopicIds,
      query,
      searchFieldFilters,
      searchIsOpen,
    } = this.state;

    const resultsMapped = results.map(result => {
      const { contentType } = contentTypeMapping[result.resourceType];
      return {
        ...result,
        title: t(`contentTypes.${contentType}`),
      };
    });
    const urlParams = queryString.parse(location.search || '');
    const activeFilters = urlParams.filters ? urlParams.filters.split(',') : [];

    return (
      <Masthead
        infoContent={
          <span>
            {t(`masthead.menu.${subject ? 'betaInfo' : 'betaInfoFront'}`)}
            {subject && <Link to="/">{t('masthead.menu.readMore')}</Link>}
          </span>
        }
        fixed>
        <MastheadItem left>
          {subject ? (
            <MenuView
              subject={subject}
              t={t}
              topicPath={topicPath || []}
              filterClick={this.filterClick}
              toggleMenu={isOpen => this.setState({ isOpen })}
              onNavigate={this.onNavigate}
              onOpenSearch={() => {
                this.setState({
                  isOpen: false,
                  searchIsOpen: true,
                });
              }}
              filters={filters}
              activeFilters={activeFilters}
              isOpen={this.state.isOpen}
              expandedTopicIds={expandedTopicIds}
              resource={resource}
              topicResourcesByType={topicResourcesByType || []}
            />
          ) : null}
        </MastheadItem>
        <MastheadItem right>
          {!location.pathname.includes('search') && (
            <SearchButtonView
              searchIsOpen={searchIsOpen}
              openToggle={isOpen => {
                this.setState({
                  searchIsOpen: isOpen,
                });
              }}
              onSearch={this.onSearch}
              onChange={this.onQueryChange}
              subject={subject}
              onFilterRemove={this.onFilterRemove}
              query={query}
              filters={searchFieldFilters}
              results={resultsMapped}
            />
          )}
          <Logo isBeta to="/" label="Nasjonal digital læringsarena" />
        </MastheadItem>
      </Masthead>
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
  results: PropTypes.arrayOf(PropTypes.object),
  groupSearch: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

const mapDispatchToProps = {
  groupSearch: searchActions.groupSearch,
};

const mapStateToProps = state => ({
  results: getGroupResults(state),
});

export default compose(
  withApollo,
  injectT,
  connect(mapStateToProps, mapDispatchToProps),
)(MastheadContainer);
