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
import { getUrnIdsFromProps } from '../../routeHelpers';
import {
  getSubjectById,
  actions as subjectActions,
} from '../SubjectPage/subjects';
import {
  getSubjectMenu,
  getTopicPath,
  actions as topicActions,
} from '../TopicPage/topic';
import {
  actions as filterActions,
  getActiveFilter,
  getFilters,
} from '../Filters/filter';
import {
  actions,
  getResourceTypesByTopicId,
  getResource,
} from '../Resources/resource';
import { SubjectShape, TopicShape, ResourceShape } from '../../shapes';
import { getGroupResults } from '../SearchPage/searchSelectors';
import * as searchActions from '../SearchPage/searchActions';
import { getArticleByUrn } from '../ArticlePage/article';
import { contentTypeMapping } from '../../util/getContentTypeFromResourceTypes';
import SearchButtonView from './SearchButtonView';
import MenuView from './MenuView';

function getSelectedTopic(topics) {
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
};

class MastheadContainer extends React.PureComponent {
  constructor(props) {
    super(props);
    const { topicPath, subject } = props;

    this.state = {
      ...initialState,
      expandedTopicIds: topicPath ? topicPath.map(topic => topic.id) : [],
      filters: subject ? [{ value: subject.id, title: subject.name }] : [],
    };
  }

  componentDidMount() {
    const { fetchSubjectFilters, fetchSubjects, fetchTopics } = this.props;
    const { subjectId, resourceId } = getUrnIdsFromProps(this.props);
    if (subjectId && this.props.filters.length === 0) {
      fetchSubjectFilters(subjectId);
    }
    if (subjectId && resourceId) {
      fetchSubjects();
      fetchTopics({ subjectId });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { location } = nextProps;
    if (location.pathname !== this.props.location.pathname) {
      this.setState(initialState); // reset on location change
    }
  }

  onNavigate = (...expandedTopicIds) => {
    const { subjectId } = getUrnIdsFromProps(this.props);
    this.setState({
      expandedTopicIds,
    });
    const selectedTopicId = getSelectedTopic(expandedTopicIds);
    if (selectedTopicId) {
      this.props.fetchTopicResources({ topicId: selectedTopicId, subjectId });
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
    const { t, subject, results, topicPath, location, ...props } = this.props;
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
              topicPath={topicPath}
              filterClick={this.filterClick}
              toggleMenu={bool => this.setState({ isOpen: bool })}
              onNavigate={this.onNavigate}
              onOpenSearch={() => {
                this.setState({
                  isOpen: false,
                  searchIsOpen: true,
                });
              }}
              {...this.state}
              {...props}
            />
          ) : null}
        </MastheadItem>
        <MastheadItem right>
          {!location.pathname.includes('search') && (
            <SearchButtonView
              isOpen={this.state.searchIsOpen}
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
  article: PropTypes.shape({
    resource: ResourceShape.isRequired,
  }),
  topics: PropTypes.arrayOf(TopicShape).isRequired,
  topicPath: PropTypes.arrayOf(TopicShape),
  filters: PropTypes.arrayOf(PropTypes.object).isRequired,
  setActiveFilter: PropTypes.func.isRequired,
  activeFilters: PropTypes.arrayOf(PropTypes.string).isRequired,
  fetchTopicResources: PropTypes.func.isRequired,
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
  fetchTopicResources: actions.fetchTopicResources,
  setActiveFilter: filterActions.setActive,
  fetchSubjectFilters: filterActions.fetchSubjectFilters,
  groupSearch: searchActions.groupSearch,
  fetchSubjects: subjectActions.fetchSubjects,
  fetchTopics: topicActions.fetchTopics,
};

const mapStateToProps = (state, ownProps) => {
  const { subjectId, topicId, resourceId } = getUrnIdsFromProps(ownProps);
  return {
    subject: getSubjectById(subjectId)(state),
    topics: getSubjectMenu(subjectId)(state),
    topicPath: getTopicPath(subjectId, topicId)(state),
    article: getArticleByUrn(resourceId)(state),
    filters: getFilters(subjectId)(state),
    activeFilters: getActiveFilter(subjectId)(state) || [],
    results: getGroupResults(state),
    resource: getResource(resourceId)(state),
    topicResourcesByType: getResourceTypesByTopicId(topicId)(state),
  };
};

export default compose(injectT, connect(mapStateToProps, mapDispatchToProps))(
  MastheadContainer,
);
