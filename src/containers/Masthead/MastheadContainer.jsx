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
} from 'ndla-ui';
import Link from 'react-router-dom/Link';
import { injectT } from 'ndla-i18n';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {
  toTopic,
  toSubject,
  toBreadcrumbItems,
  getUrnIdsFromProps,
} from '../../routeHelpers';
import { getSubjectById } from '../SubjectPage/subjects';
import { getSubjectMenu, getTopicPath } from '../TopicPage/topic';
import {
  actions as filterActions,
  getActiveFilter,
  getFilters,
} from '../Filters/filter';
import { actions } from '../Resources/resource';
import { resourceToLinkProps } from '../Resources/resourceHelpers';
import { SubjectShape, TopicShape, ResourceShape } from '../../shapes';
import { getArticleByUrn } from '../ArticlePage/article';

function toTopicWithSubjectIdBound(subjectId) {
  return toTopic.bind(undefined, subjectId);
}

function getSelectedTopic(topics) {
  return [...topics] // prevent reverse mutation.
    .reverse()
    .find(topicId => topicId !== undefined && topicId !== null);
}

const initialState = {
  isOpen: false,
  expandedTopicIds: [],
};
class MastheadContainer extends React.PureComponent {
  state = initialState;

  componentWillMount() {
    const { topicPath } = this.props;
    if (topicPath) {
      this.setState({
        expandedTopicIds: topicPath.map(topic => topic.id),
      });
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
      article,
      topics,
      topicPath,
      filters,
      activeFilters,
    } = this.props;
    const { expandedTopicIds } = this.state;
    const [
      expandedTopicId,
      expandedSubtopicId,
      expandedSubtopicLevel2Id,
    ] = expandedTopicIds;
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
                  back: t('masthead.menu.back'),
                  closeButton: t('masthead.menu.close'),
                  contentTypeResultsShowMore: t(
                    'masthead.menu.contentTypeResultsShowMore',
                  ),
                  contentTypeResultsShowLess: t(
                    'masthead.menu.contentTypeResultsShowLess',
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
                expandedSubtopicLevel2Id={expandedSubtopicLevel2Id}
                searchPageUrl="#"
                resourceToLinkProps={resourceToLinkProps}
              />
            </ClickToggle>
          ) : null}
          {subject ? (
            <DisplayOnPageYOffset yOffsetMin={150}>
              <BreadcrumbBlock
                items={toBreadcrumbItems(
                  subject,
                  topicPath,
                  article ? article.resource : undefined,
                ).slice(1)}
              />
            </DisplayOnPageYOffset>
          ) : null}
        </MastheadItem>
        <MastheadItem right>
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
};

const mapDispatchToProps = {
  fetchTopicResources: actions.fetchTopicResources,
  setActiveFilter: filterActions.setActive,
  fetchSubjectFilters: filterActions.fetchSubjectFilters,
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
  };
};

export default compose(injectT, connect(mapStateToProps, mapDispatchToProps))(
  MastheadContainer,
);
