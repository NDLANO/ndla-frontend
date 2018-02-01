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
  BreadcrumbBlock,
  DisplayOnPageYOffset,
  Masthead,
  MastheadItem,
  Logo,
  ClickToggle,
  TopicMenu,
  ContentTypeBadge,
} from 'ndla-ui';
import { injectT } from 'ndla-i18n';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { toTopic, toSubject } from '../../routeHelpers';
import { getSubjectById } from '../SubjectPage/subjects';
import { getSubjectMenu, getTopicPath } from '../TopicPage/topic';
import {
  actions as filterActions,
  getActiveFilter,
  getFilters,
} from '../Filters/filter';
import { SubjectShape, TopicShape } from '../../shapes';
import { actions, getResourceTypesByTopicId } from '../Resources/resource';
import getContentTypeFromResourceTypes from '../../components/getContentTypeFromResourceTypes';

function toTopicWithSubjectIdBound(subjectId) {
  return toTopic.bind(undefined, subjectId);
}

function mapResourcesToMenu(resourceTypeArray) {
  return resourceTypeArray.map(type => ({
    ...type,
    title: type.name,
    totalCount: type.resources.length,
    icon: (
      <ContentTypeBadge
        type={getContentTypeFromResourceTypes([type]).contentType}
        size="x-small"
      />
    ),
  }));
}

class MastheadContainer extends React.PureComponent {
  state = { isOpen: false };

  componentDidMount() {
    if (this.props.filters.length === 0)
      this.props.fetchSubjectFilters(this.props.match.params.subjectId);
  }

  onNavigate = (expandedTopicId, expandedSubtopicId) => {
    const { match: { params: { subjectId } } } = this.props;
    this.setState({
      expandedTopicId,
      expandedSubtopicId,
    });
    const newTopic = expandedSubtopicId || expandedTopicId;
    if (newTopic)
      this.props.fetchTopicResources({ topicId: newTopic, subjectId });
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
      topics,
      topicPath,
      filters,
      activeFilters,
      topicResourcesByType,
    } = this.props;
    const getResources = this.state.expandedTopicId
      ? topicResourcesByType(
          this.state.expandedSubtopicId || this.state.expandedTopicId,
        )
      : [];
    return (
      <Masthead fixed>
        <MastheadItem left>
          {subject ? (
            <ClickToggle
              title={t('masthead.menu.title')}
              openTitle={t('masthead.menu.close')}
              className="c-topic-menu-container"
              isOpen={this.state.isOpen}
              onToggle={bool => this.setState({ isOpen: bool })}
              buttonClassName="c-btn c-button--outline c-topic-menu-toggle-button">
              <TopicMenu
                hideSearch
                toSubject={() => toSubject(subject.id)}
                subjectTitle={subject.name}
                toTopic={toTopicWithSubjectIdBound(subject.id)}
                topics={topics}
                withSearchAndFilter
                messages={{
                  goTo: t('masthead.menu.goTo'),
                  subjectOverview: t('masthead.menu.subjectOverview'),
                  search: t('masthead.menu.search'),
                  subjectPage: t('masthead.menu.subjectPage'),
                  learningResourcesHeading: t(
                    'masthead.menu.learningResourcesHeading',
                  ),
                  back: 'Tilbake',
                  contentTypeResultsShowMore: t(
                    'masthead.menu.contentTypeResultsShowMore',
                  ),
                }}
                filterOptions={filters}
                onFilterClick={this.filterClick}
                filterValues={activeFilters}
                onOpenSearch={() => {}}
                onNavigate={this.onNavigate}
                expandedTopicId={this.state.expandedTopicId}
                expandedSubtopicId={this.state.expandedSubtopicId}
                searchPageUrl="#"
                contentTypeResults={mapResourcesToMenu(getResources)}
              />
            </ClickToggle>
          ) : null}
          {subject ? (
            <DisplayOnPageYOffset yOffset={150}>
              <BreadcrumbBlock
                subject={subject}
                topicPath={topicPath}
                toTopic={toTopic}
              />
            </DisplayOnPageYOffset>
          ) : null}
        </MastheadItem>
        <MastheadItem right>
          <Logo to="/" altText="Nasjonal digital læringsarena" />
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
  t: PropTypes.func.isRequired,
  subject: SubjectShape,
  topics: PropTypes.arrayOf(TopicShape).isRequired,
  topicPath: PropTypes.arrayOf(TopicShape),
  filters: PropTypes.arrayOf(PropTypes.object).isRequired,
  setActiveFilter: PropTypes.func.isRequired,
  activeFilters: PropTypes.arrayOf(PropTypes.string).isRequired,
  topicResourcesByType: PropTypes.func.isRequired,
  fetchTopicResources: PropTypes.func.isRequired,
  fetchSubjectFilters: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  fetchTopicResources: actions.fetchTopicResources,
  setActiveFilter: filterActions.setActive,
  fetchSubjectFilters: filterActions.fetchSubjectFilters,
};

const mapStateToProps = (state, ownProps) => {
  const { subjectId, topicId } = ownProps.match.params;
  return {
    subject: getSubjectById(subjectId)(state),
    topics: getSubjectMenu(subjectId)(state),
    topicResourcesByType: topic => getResourceTypesByTopicId(topic)(state),
    topicPath: getTopicPath(subjectId, topicId)(state),
    filters: getFilters(subjectId)(state),
    activeFilters: getActiveFilter(subjectId)(state) || [],
  };
};

export default compose(injectT, connect(mapStateToProps, mapDispatchToProps))(
  MastheadContainer,
);
