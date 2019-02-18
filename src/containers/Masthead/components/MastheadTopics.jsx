import React from 'react';
import PropTypes from 'prop-types';
import { TopicMenu } from '@ndla/ui';
import { toSubject, removeUrn } from '../../../routeHelpers';
import { resourceToLinkProps } from '../../Resources/resourceHelpers';
import {
  mapTopicResourcesToTopic,
  toTopicWithSubjectIdBound,
} from '../mastheadHelpers';
import { TopicShape } from '../../../shapes';

const MastheadTopics = props => {
  const {
    onClose,
    subject,
    activeFilters,
    filters,
    expandedTopicId,
    expandedSubtopicsId,
    topicResourcesByType,
    locale,
    onFilterClick,
    onNavigate,
    searchFieldComponent,
    isOnSubjectFrontPage,
  } = props;

  const topicsWithContentTypes = mapTopicResourcesToTopic(
    subject.topics,
    expandedTopicId,
    topicResourcesByType,
    expandedSubtopicsId,
  );

  const resourceToLinkPropsWithFilters = resource => {
    const subjectTopicPath = [subject.id, ...expandedSubtopicsId]
      .map(removeUrn)
      .join('/');
    return resourceToLinkProps(
      resource,
      '/' + subjectTopicPath,
      activeFilters.join(','),
      locale,
    );
  };

  return (
    <TopicMenu
      close={onClose}
      toFrontpage={() => '/'}
      searchFieldComponent={searchFieldComponent}
      topics={topicsWithContentTypes}
      toTopic={toTopicWithSubjectIdBound(subject.id, activeFilters.join(','))}
      toSubject={() => toSubject(subject.id)}
      isOnSubjectFrontPage={isOnSubjectFrontPage}
      defaultCount={12}
      messages={{
        subjectPage: 'masthead.menu.subjectPage',
        learningResourcesHeading: 'masthead.menu.learningResourcesHeading',
        back: 'masthead.menu.back',
        goTo: 'masthead.menu.goTo',
        contentTypeResultsShowMore: 'masthead.menu.contentTypeResultsShowMore',
        contentTypeResultsShowLess: 'masthead.menu.contentTypeResultsShowLess',
        contentTypeResultsNoHit: 'masthead.menu.contentTypeResultsNoHit',
      }}
      additionalTooltipLabel=""
      filterOptions={filters}
      onFilterClick={onFilterClick}
      subjectTitle={subject.name}
      resourceToLinkProps={resourceToLinkPropsWithFilters}
      filterValues={activeFilters}
      onNavigate={onNavigate}
      expandedTopicId={expandedTopicId}
      expandedSubtopicsId={expandedSubtopicsId}
    />
  );
};

MastheadTopics.propTypes = {
  subject: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    topics: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  topicResourcesByType: PropTypes.arrayOf(TopicShape).isRequired,
  activeFilters: PropTypes.arrayOf(PropTypes.string).isRequired,
  expandedTopicId: PropTypes.string,
  expandedSubtopicsId: PropTypes.arrayOf(PropTypes.string).isRequired,
  filters: PropTypes.arrayOf(PropTypes.object).isRequired,
  locale: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onFilterClick: PropTypes.func.isRequired,
  onNavigate: PropTypes.func.isRequired,
  searchFieldComponent: PropTypes.node.isRequired,
  isOnSubjectFrontPage: PropTypes.bool,
};

export default MastheadTopics;
