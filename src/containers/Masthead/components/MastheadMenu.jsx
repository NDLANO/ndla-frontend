import React, { Component, Fragment } from 'react';
import { node, shape, func, string, arrayOf, object, bool } from 'prop-types';
import { withRouter } from 'react-router-dom';
import { TopicShape, ResourceShape, LocationShape } from '../../../shapes';
import { getUrnIdsFromProps, isSubjectPagePath } from '../../../routeHelpers';
import { getSelectedTopic } from '../mastheadHelpers';
import { getFiltersFromUrlAsArray } from '../../../util/filterHelper';
import MastheadTopics from './MastheadTopics';
import MastheadMenuModal from './MastheadMenuModal';

class MastheadMenu extends Component {
  constructor() {
    super();
    this.state = {
      activeFilters: [],
      expandedTopicId: null,
      expandedSubtopicsId: [],
      location: null,
    };
  }

  onFilterClick = activeFilters => {
    const { onDataFetch } = this.props;
    const { subjectId, topicId, resourceId } = getUrnIdsFromProps(this.props);

    const selectedTopicId = getSelectedTopic([
      this.state.expandedTopicId,
      ...this.state.expandedSubtopicsId,
    ]);

    this.setState({ activeFilters });
    onDataFetch(
      subjectId,
      selectedTopicId || topicId,
      resourceId,
      activeFilters,
    );
  };

  onNavigate = async (expandedTopicId, subtopicId, currentIndex) => {
    const { onDataFetch } = this.props;
    let { expandedSubtopicsId } = this.state;

    if (expandedSubtopicsId.length > currentIndex) {
      expandedSubtopicsId = expandedSubtopicsId.slice(0, currentIndex);
    }
    if (subtopicId) {
      expandedSubtopicsId.push(subtopicId);
    } else {
      expandedSubtopicsId.pop();
    }
    this.setState({
      expandedTopicId,
      expandedSubtopicsId,
    });

    const selectedTopicId = getSelectedTopic([
      expandedTopicId,
      ...expandedSubtopicsId,
    ]);

    if (selectedTopicId) {
      const { subjectId, resourceId } = getUrnIdsFromProps(this.props);
      onDataFetch(
        subjectId,
        selectedTopicId,
        resourceId,
        this.state.activeFilters,
      );
    }
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const { location } = nextProps;
    if (location !== prevState.location) {
      const activeFilters = getFiltersFromUrlAsArray(location);
      const { topicList } = getUrnIdsFromProps(nextProps);
      return {
        expandedTopicId: topicList?.[0] || null,
        expandedSubtopicsId: topicList?.slice(1) || [],
        activeFilters,
        location,
      };
    }
    return null;
  }

  render() {
    const {
      subject,
      location,
      filters,
      topicResourcesByType,
      locale,
      searchFieldComponent,
      ndlaFilm,
    } = this.props;

    const { activeFilters, expandedTopicId, expandedSubtopicsId } = this.state;

    return (
      <Fragment>
        <MastheadMenuModal onMenuExit={this.onMenuExit} ndlaFilm={ndlaFilm}>
          {onClose => (
            <MastheadTopics
              onClose={onClose}
              searchFieldComponent={searchFieldComponent}
              isOnSubjectFrontPage={isSubjectPagePath(location.pathname)}
              activeFilters={activeFilters}
              expandedTopicId={expandedTopicId}
              expandedSubtopicsId={expandedSubtopicsId}
              topicResourcesByType={topicResourcesByType}
              subject={subject}
              filters={filters}
              locale={locale}
              onFilterClick={this.onFilterClick}
              onNavigate={this.onNavigate}
            />
          )}
        </MastheadMenuModal>
      </Fragment>
    );
  }
}

MastheadMenu.propTypes = {
  subject: shape({
    id: string,
    name: string,
    topics: arrayOf(object),
  }).isRequired,
  locale: string.isRequired,
  resource: ResourceShape,
  filters: arrayOf(object),
  topicResourcesByType: arrayOf(TopicShape).isRequired,
  topicPath: arrayOf(TopicShape).isRequired,
  location: LocationShape,
  onDataFetch: func.isRequired,
  searchFieldComponent: node.isRequired,
  ndlaFilm: bool,
};

export default withRouter(MastheadMenu);
