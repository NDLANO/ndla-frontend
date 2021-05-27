import React from 'react';
import PropTypes, { arrayOf } from 'prop-types';
import { TopicMenu } from '@ndla/ui';
import { toSubject, removeUrn, toTopic } from '../../../routeHelpers';
import { resourceToLinkProps } from '../../Resources/resourceHelpers';
import { mapTopicResourcesToTopic } from '../mastheadHelpers';
import {
  ProgrammeShape,
  SubjectCategoryShape,
  TopicShape,
} from '../../../shapes';
import { getSubjectBySubjectId } from '../../../data/subjects';

export function toTopicWithBoundParams(subjectId, filters, expandedTopicIds) {
  return topicId => {
    // expandedTopics is an array like this: [mainTopic, subtopic, subsubtopic, etc]
    // topicId is always either mainTopic, subtopic, subsubtopic, etc
    // It implies that we can use expandedTopics to create a path of
    // topic ids we can send to toTopic().
    const index = expandedTopicIds.indexOf(topicId);
    const topicIds = expandedTopicIds.slice(0, index + 1);
    return toTopic(subjectId, filters, ...topicIds);
  };
}

const MastheadTopics = props => {
  const {
    onClose,
    subject,
    activeFilters,
    expandedTopicId,
    expandedSubtopicsId,
    topicResourcesByType,
    locale,
    onFilterClick,
    onNavigate,
    searchFieldComponent,
    isOnSubjectFrontPage,
    programmes,
    subjectCategories,
  } = props;

  const expandedTopicIds = [expandedTopicId, ...expandedSubtopicsId];

  const topicsWithContentTypes = mapTopicResourcesToTopic(
    subject.topics,
    expandedTopicId,
    topicResourcesByType,
    expandedSubtopicsId,
  );

  const resourceToLinkPropsWithFilters = resource => {
    const subjectTopicPath = [subject.id, ...expandedTopicIds]
      .map(removeUrn)
      .join('/');
    return resourceToLinkProps(
      resource,
      '/' + subjectTopicPath,
      activeFilters.join(','),
      locale,
    );
  };

  const subjectData = getSubjectBySubjectId(subject?.id, activeFilters);
  const subjectTitle = subjectData?.name[locale] || subject?.name;

  return (
    <TopicMenu
      close={onClose}
      toFrontpage={() => '/'}
      searchFieldComponent={searchFieldComponent}
      topics={topicsWithContentTypes}
      toTopic={toTopicWithBoundParams(
        subject.id,
        activeFilters.join(','),
        expandedTopicIds,
      )}
      toSubject={() => toSubject(subject.id, activeFilters)}
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
      onFilterClick={onFilterClick}
      subjectTitle={subjectTitle}
      resourceToLinkProps={resourceToLinkPropsWithFilters}
      filterValues={activeFilters}
      onNavigate={onNavigate}
      expandedTopicId={expandedTopicId}
      expandedSubtopicsId={expandedSubtopicsId}
      programmes={programmes}
      subjectCategories={subjectCategories}
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
  locale: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onFilterClick: PropTypes.func.isRequired,
  onNavigate: PropTypes.func.isRequired,
  searchFieldComponent: PropTypes.node.isRequired,
  isOnSubjectFrontPage: PropTypes.bool,
  subjectCategories: arrayOf(SubjectCategoryShape),
  programmes: arrayOf(ProgrammeShape),
};

export default MastheadTopics;
