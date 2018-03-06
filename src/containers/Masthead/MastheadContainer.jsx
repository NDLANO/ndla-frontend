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
import Link from 'react-router-dom/Link';
import { injectT } from 'ndla-i18n';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {
  toTopic,
  toSubject,
  toSubjects,
  getUrnIdsFromProps,
} from '../../routeHelpers';
import { getSubjectById } from '../SubjectPage/subjects';
import { getSubjectMenu, getTopicPath } from '../TopicPage/topic';
import {
  actions as filterActions,
  getActiveFilter,
  getFilters,
} from '../Filters/filter';
import { SubjectShape, TopicShape } from '../../shapes';
import { actions, getResourceTypesByTopicId } from '../Resources/resource';
import getContentTypeFromResourceTypes from '../../util/getContentTypeFromResourceTypes';

function toTopicWithSubjectIdBound(subjectId) {
  return toTopic.bind(undefined, subjectId);
}

function mapResourcesToMenu(resourceTypeArray, topicUrl) {
  return resourceTypeArray.map(type => ({
    ...type,
    resources: type.resources
      .slice(0, 2)
      .map(resource => ({ ...resource, path: toSubjects() + resource.path })),
    title: type.name,
    totalCount: type.resources.length,
    showAllLinkUrl: type.resources.length >= 2 ? topicUrl : undefined,
    icon: (
      <ContentTypeBadge
        type={getContentTypeFromResourceTypes([type]).contentType}
        size="x-small"
      />
    ),
  }));
}

const initialState = {
  isOpen: false,
  expandedTopicId: undefined,
  expandedSubtopicId: undefined,
};
class MastheadContainer extends React.PureComponent {
  state = initialState;

  componentWillMount() {
    const { topicPath } = this.props;
    if (topicPath) {
      const expandedTopicId =
        topicPath.length > 0 ? topicPath[0].id : undefined;
      const expandedSubtopicId =
        topicPath.length > 1 ? topicPath[1].id : undefined;
      this.setState({ expandedTopicId, expandedSubtopicId });
    }
  }

  componentDidMount() {
    const { subjectId } = getUrnIdsFromProps(this.props);

    if (subjectId && this.props.filters.length === 0) {
      this.props.fetchSubjectFilters(subjectId);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.pathname !== this.props.location.pathname) {
      this.setState(initialState); // reset on location change

      // remove active topic if filtered away
    } else if (
      nextProps.activeFilters.length !== this.props.activeFilters.length
    ) {
      const { expandedTopicId, expandedSubtopicId } = this.state;
      if (nextProps.topics.indexOf(expandedTopicId) === -1) {
        this.setState({ expandedTopicId: undefined });
      }
      if (this.props.topics.indexOf(expandedSubtopicId) === -1) {
        this.setState({ expandedSubtopicId: undefined });
      }
    }
  }

  onNavigate = (expandedTopicId, expandedSubtopicId) => {
    const { subjectId } = getUrnIdsFromProps(this.props);
    this.setState({
      expandedTopicId,
      expandedSubtopicId,
    });
    const newTopic = expandedSubtopicId || expandedTopicId;
    if (newTopic) {
      this.props.fetchTopicResources({ topicId: newTopic, subjectId });
    }
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
    const { expandedTopicId, expandedSubtopicId } = this.state;
    const getResources = expandedTopicId
      ? topicResourcesByType(expandedSubtopicId || expandedTopicId)
      : [];
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
            <ClickToggle
              title={t('masthead.menu.title')}
              openTitle={t('masthead.menu.close')}
              className="c-topic-menu-container"
              isOpen={this.state.isOpen}
              onToggle={bool => this.setState({ isOpen: bool })}
              buttonClassName="c-btn c-button--outline c-topic-menu-toggle-button">
              <TopicMenu
                hideSearch
                isBeta
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
                  contentTypeResultsNoHit: t(
                    'masthead.menu.contentTypeResultsNoHit',
                  ),
                }}
                filterOptions={filters}
                onFilterClick={this.filterClick}
                filterValues={activeFilters}
                onOpenSearch={() => {}}
                onNavigate={this.onNavigate}
                expandedTopicId={expandedTopicId}
                expandedSubtopicId={expandedSubtopicId}
                searchPageUrl="#"
                contentTypeResults={mapResourcesToMenu(
                  getResources,
                  toTopic(subject.id, expandedTopicId, expandedSubtopicId),
                )}
              />
            </ClickToggle>
          ) : null}
          {subject ? (
            <DisplayOnPageYOffset yOffsetMin={150}>
              <BreadcrumbBlock
                subject={subject}
                topicPath={topicPath}
                toTopic={toTopic}
              />
            </DisplayOnPageYOffset>
          ) : null}
        </MastheadItem>
        <MastheadItem right>
          <Logo isBeta to="/" altText="Nasjonal digital læringsarena" />
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
  const { subjectId, topicId } = getUrnIdsFromProps(ownProps);
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
