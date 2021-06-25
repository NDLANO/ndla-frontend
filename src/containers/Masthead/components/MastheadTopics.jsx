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
import { getSubjectLongName } from '../../../data/subjects';

export function toTopicWithBoundParams(subjectId, expandedTopicIds) {
  return topicId => {
    // expandedTopics is an array like this: [mainTopic, subtopic, subsubtopic, etc]
    // topicId is always either mainTopic, subtopic, subsubtopic, etc
    // It implies that we can use expandedTopics to create a path of
    // topic ids we can send to toTopic().
    const index = expandedTopicIds.indexOf(topicId);
    const topicIds = expandedTopicIds.slice(0, index + 1);
    return toTopic(subjectId, ...topicIds);
  };
}

const MastheadTopics = props => {
  const {
    onClose,
    subject,
    expandedTopicId,
    expandedSubtopicsId,
    topicResourcesByType,
    locale,
    onNavigate,
    searchFieldComponent,
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

  const localResourceToLinkProps = resource => {
    const subjectTopicPath = [subject.id, ...expandedTopicIds]
      .map(removeUrn)
      .join('/');
    return resourceToLinkProps(resource, '/' + subjectTopicPath, locale);
  };

  const subjectTitle = getSubjectLongName(subject.id, locale) || subject?.name;

  return (
    <TopicMenu
      close={onClose}
      toFrontpage={() => '/'}
      searchFieldComponent={searchFieldComponent}
      topics={topicsWithContentTypes}
      toTopic={toTopicWithBoundParams(subject.id, expandedTopicIds)}
      toSubject={() => toSubject(subject.id)}
      defaultCount={12}
      subjectTitle={subjectTitle}
      resourceToLinkProps={localResourceToLinkProps}
      onNavigate={onNavigate}
      expandedTopicId={expandedTopicId}
      expandedSubtopicsId={expandedSubtopicsId}
      programmes={programmes}
      subjectCategories={subjectCategories}
      locale={locale}
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
  expandedTopicId: PropTypes.string,
  expandedSubtopicsId: PropTypes.arrayOf(PropTypes.string).isRequired,
  locale: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onNavigate: PropTypes.func.isRequired,
  searchFieldComponent: PropTypes.node.isRequired,
  subjectCategories: arrayOf(SubjectCategoryShape),
  programmes: arrayOf(ProgrammeShape),
};

export default MastheadTopics;
