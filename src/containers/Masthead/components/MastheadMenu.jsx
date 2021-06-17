import React, { Component, Fragment } from 'react';
import { node, shape, func, string, arrayOf, object, bool } from 'prop-types';
import { withRouter } from 'react-router-dom';
import {
  TopicShape,
  ResourceShape,
  LocationShape,
  SubjectCategoryShape,
  ProgrammeShape,
} from '../../../shapes';
import { getUrnIdsFromProps } from '../../../routeHelpers';
import { getSelectedTopic } from '../mastheadHelpers';
import MastheadTopics from './MastheadTopics';
import MastheadMenuModal from './MastheadMenuModal';

class MastheadMenu extends Component {
  constructor() {
    super();
    this.state = {
      expandedTopicId: null,
      expandedSubtopicsId: [],
      location: null,
    };
  }

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
      onDataFetch(subjectId, selectedTopicId, resourceId);
    }
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const { location } = nextProps;
    if (location !== prevState.location) {
      const { topicList } = getUrnIdsFromProps(nextProps);
      return {
        expandedTopicId: topicList?.[0] || null,
        expandedSubtopicsId: topicList?.slice(1) || [],
        location,
      };
    }
    return null;
  }

  render() {
    const {
      subject,
      topicResourcesByType,
      locale,
      searchFieldComponent,
      ndlaFilm,
      programmes,
      subjectCategories,
    } = this.props;

    const { expandedTopicId, expandedSubtopicsId } = this.state;

    return (
      <Fragment>
        <MastheadMenuModal onMenuExit={this.onMenuExit} ndlaFilm={ndlaFilm}>
          {onClose => (
            <MastheadTopics
              onClose={onClose}
              searchFieldComponent={searchFieldComponent}
              expandedTopicId={expandedTopicId}
              expandedSubtopicsId={expandedSubtopicsId}
              topicResourcesByType={topicResourcesByType}
              subject={subject}
              locale={locale}
              programmes={programmes}
              subjectCategories={subjectCategories}
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
  topicResourcesByType: arrayOf(TopicShape).isRequired,
  topicPath: arrayOf(TopicShape).isRequired,
  location: LocationShape,
  onDataFetch: func.isRequired,
  searchFieldComponent: node.isRequired,
  ndlaFilm: bool,
  subjectCategories: arrayOf(SubjectCategoryShape),
  programmes: arrayOf(ProgrammeShape),
};

export default withRouter(MastheadMenu);
