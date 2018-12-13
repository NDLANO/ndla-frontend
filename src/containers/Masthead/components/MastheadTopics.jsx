import React from 'react';
import { node, shape, func, string, arrayOf, object } from 'prop-types';
import { TopicMenu } from '@ndla/ui';
import { toSubject } from '../../../routeHelpers';
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
  } = props;

  const topicsWithContentTypes = mapTopicResourcesToTopic(
    subject.topics,
    expandedTopicId,
    topicResourcesByType,
    expandedSubtopicsId,
  );

  const resourceToLinkPropsWithFilters = (resource, subjectTopicPath) =>
    resourceToLinkProps(
      resource,
      subjectTopicPath,
      activeFilters.join(','),
      locale,
    );

  return (
    <TopicMenu
      close={onClose}
      toFrontpage={() => '/'}
      searchFieldComponent={searchFieldComponent}
      topics={topicsWithContentTypes}
      toTopic={toTopicWithSubjectIdBound(subject.id, activeFilters.join(','))}
      toSubject={() => toSubject(subject.id)}
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
  subject: shape({
    id: string,
    name: string,
    topics: arrayOf(object),
  }).isRequired,
  topicResourcesByType: arrayOf(TopicShape).isRequired,
  activeFilters: arrayOf(string).isRequired,
  expandedTopicId: string,
  expandedSubtopicsId: arrayOf(string).isRequired,
  filters: arrayOf(object).isRequired,
  locale: string.isRequired,
  onClose: func.isRequired,
  onFilterClick: func.isRequired,
  onNavigate: func.isRequired,
  searchFieldComponent: node.isRequired,
};

export default MastheadTopics;
