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
import {
  getSubjectById,
  actions as subjectActions,
} from '../SubjectPage/subjects';
import { getSubjectMenu, actions as topicActions } from '../TopicPage/topic';

import { getTopicPath } from '../../util/getTopicPath';
import {
  actions as filterActions,
  getActiveFilter,
  getFilters,
} from '../Filters/filter';
import { SubjectShape, TopicShape } from '../../shapes';
import { getGroupResults } from '../SearchPage/searchSelectors';
import * as searchActions from '../SearchPage/searchActions';
import { getArticleByUrn } from '../ArticlePage/article';
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

export function getSelectedTopic(topics) {
  return [...topics] // prevent reverse mutation.
    .reverse()
    .find(topicId => topicId !== undefined && topicId !== null);
}

const initialState = {
  isOpen: false,
  subjectId: undefined,
  query: '',
  filters: [],
  searchIsOpen: false,
  expandedTopicIds: [],
  data: {},
};

class MastheadContainer extends React.PureComponent {
  constructor(props) {
    super(props);
    const { subject } = props;

    this.state = {
      ...initialState,
      filters: subject ? [{ value: subject.id, title: subject.name }] : [],
    };
  }

  async componentDidMount() {
    const { fetchSubjectFilters, fetchSubjects, fetchTopics } = this.props;
    const { subjectId, resourceId, topicId } = getUrnIdsFromProps(this.props);
    if (subjectId && this.props.filters.length === 0) {
      fetchSubjectFilters(subjectId);
    }
    if (subjectId && resourceId) {
      fetchSubjects();
      fetchTopics({ subjectId });
    }

    if (topicId) {
      const data = await this.getData(subjectId, topicId, resourceId);
      this.setState({
        data,
        expandedTopicIds: data.topicPath.map(topic => topic.id),
      });
    }
  }

  async componentWillReceiveProps(nextProps) {
    const { location } = nextProps;
    if (location.pathname !== this.props.location.pathname) {
      const { subjectId, resourceId, topicId } = getUrnIdsFromProps(nextProps);
      const data = await this.getData(subjectId, topicId, resourceId);
      this.setState({
        data,
        expandedTopicIds: data.topicPath.map(topic => topic.id),
      });
    }
  }

  onNavigate = async (...expandedTopicIds) => {
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
      const data = await this.getData(subjectId, selectedTopicId, resourceId);
      this.setState({ data });
    }
  };

  onFilterRemove = () => {
    this.setState({ filters: [] });
  };

  onQueryChange = query => {
    this.setState({ query }, this.executeSearch(query));
  };

  onSearch = evt => {
    evt.preventDefault();

    const { history, subject } = this.props;
    const { query } = this.state;
    this.executeSearch(this.state.query);
    history.push({
      pathname: '/search',
      search: `?${queryString.stringify({
        query: query.length > 0 ? query : undefined,
        subjects: subject ? subject.id : undefined,
      })}`,
    });
  };

  getData = async (subjectId, topicId, resourceId) => {
    try {
      const queries = [
        {
          query: subjectQuery,
          variables: { subjectId },
        },
        { query: topicResourcesQuery, variables: { topicId } },
        { query: resourceTypesQuery },
      ];

      if (resourceId) {
        queries.push({
          query: resourceQuery,
          variables: { resourceId },
        });
      }

      const { data } = await runQueries(this.props.client, queries);
      const { resourceTypes, topic: { coreResources } } = data;
      const topicResourcesByType = getResourceGroups(
        resourceTypes,
        [],
        coreResources,
      );
      const topicPath =
        data.subject && data.subject.topics
          ? getTopicPath(subjectId, topicId, data.subject.topics)
          : [];

      return { resource: data.resource, topicResourcesByType, topicPath };
    } catch (e) {
      handleError(e);
      return { error: true };
    }
  };

  executeSearch = query => {
    const { groupSearch } = this.props;
    const { filters } = this.state;

    const searchParams = {
      query,
      subjects:
        filters.length > 0
          ? filters.map(filter => filter.value).join(',')
          : undefined,
      'resource-types':
        'urn:resourcetype:learningPath,urn:resourcetype:subjectMaterial,urn:resourcetype:tasksAndActivities',
    };
    groupSearch(`?${queryString.stringify(searchParams)}`);
  };

  filterClick = (newValues, filterId) =>
    this.props.setActiveFilter({
      newValues,
      subjectId: this.props.subject.id,
      filterId,
    });

  render() {
    const {
      t,
      subject,
      results,
      location,
      topics,
      filters,
      activeFilters,
    } = this.props;
    const { data } = this.state;
    const resultsMapped = results.map(result => {
      const { contentType } = contentTypeMapping[result.resourceType];
      return {
        ...result,
        title: t(`contentTypes.${contentType}`),
      };
    });

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
              topicPath={data.topicPath || []}
              filterClick={this.filterClick}
              toggleMenu={bool => this.setState({ isOpen: bool })}
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
              expandedTopicIds={this.state.expandedTopicIds}
              resource={data.resource}
              topics={topics}
              topicResourcesByType={data.topicResourcesByType || []}
            />
          ) : null}
        </MastheadItem>
        <MastheadItem right>
          {!location.pathname.includes('search') && (
            <SearchButtonView
              searchIsOpen={this.state.searchIsOpen}
              openToggle={isOpen => {
                this.setState({
                  searchIsOpen: isOpen,
                });
              }}
              onSearch={this.onSearch}
              onChange={this.onQueryChange}
              subject={subject}
              onFilterRemove={this.onFilterRemove}
              query={this.state.query}
              filters={this.state.filters}
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
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }),
  t: PropTypes.func.isRequired,
  subject: SubjectShape,
  client: PropTypes.shape({ query: PropTypes.func.isRequired }).isRequired,
  topics: PropTypes.arrayOf(TopicShape).isRequired,
  topicPath: PropTypes.arrayOf(TopicShape),
  filters: PropTypes.arrayOf(PropTypes.object).isRequired,
  setActiveFilter: PropTypes.func.isRequired,
  activeFilters: PropTypes.arrayOf(PropTypes.string).isRequired,
  fetchSubjectFilters: PropTypes.func.isRequired,
  fetchTopics: PropTypes.func.isRequired,
  fetchSubjects: PropTypes.func.isRequired,
  results: PropTypes.arrayOf(PropTypes.object),
  groupSearch: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

const mapDispatchToProps = {
  setActiveFilter: filterActions.setActive,
  fetchSubjectFilters: filterActions.fetchSubjectFilters,
  groupSearch: searchActions.groupSearch,
  fetchSubjects: subjectActions.fetchSubjects,
  fetchTopics: topicActions.fetchTopics,
};

const mapStateToProps = (state, ownProps) => {
  const { subjectId, resourceId } = getUrnIdsFromProps(ownProps);
  return {
    subject: getSubjectById(subjectId)(state),
    topics: getSubjectMenu(subjectId)(state),
    article: getArticleByUrn(resourceId)(state),
    filters: getFilters(subjectId)(state),
    activeFilters: getActiveFilter(subjectId)(state) || [],
    results: getGroupResults(state),
  };
};

export default compose(
  withApollo,
  injectT,
  connect(mapStateToProps, mapDispatchToProps),
)(MastheadContainer);
