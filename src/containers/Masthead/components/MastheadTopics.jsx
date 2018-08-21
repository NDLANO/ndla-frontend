import React from 'react';
import { shape, func, string, arrayOf, object } from 'prop-types';
import { TopicMenu } from 'ndla-ui';
import { injectT } from 'ndla-i18n';
import { toSubject } from '../../../routeHelpers';
import { resourceToLinkProps } from '../../Resources/resourceHelpers';
import {
  mapTopicResourcesToTopic,
  toTopicWithSubjectIdBound,
  getSelectedTopic,
} from '../mastheadHelpers';
import { TopicShape } from '../../../shapes';

const MastheadTopics = props => {
  const {
    onClose,
    subject,
    t,
    activeFilters,
    filters,
    onOpenSearch,
    expandedTopicIds,
    topicResourcesByType,
    onFilterClick,
    onNavigate,
  } = props;

  const [
    expandedTopicId,
    expandedSubtopicId,
    expandedSubtopicLevel2Id,
  ] = expandedTopicIds;

  const topicsWithContentTypes = mapTopicResourcesToTopic(
    subject.topics,
    getSelectedTopic(expandedTopicIds),
    topicResourcesByType,
    activeFilters.join(','),
  );

  const resourceToLinkPropsWithFilters = (resource, subjectTopicPath) =>
    resourceToLinkProps(resource, subjectTopicPath, activeFilters.join(','));

  return (
    <TopicMenu
      close={onClose}
      toSubject={() => toSubject(subject.id)}
      subjectTitle={subject.name}
      toTopic={toTopicWithSubjectIdBound(subject.id, activeFilters.join(','))}
      topics={topicsWithContentTypes}
      withSearchAndFilter
      messages={{
        goTo: t('masthead.menu.goTo'),
        subjectOverview: t('masthead.menu.subjectOverview'),
        search: t('masthead.menu.search'),
        subjectPage: t('masthead.menu.subjectPage'),
        learningResourcesHeading: t('masthead.menu.learningResourcesHeading'),
        back: t('masthead.menu.back'),
        closeButton: t('masthead.menu.close'),
        contentTypeResultsShowMore: t(
          'masthead.menu.contentTypeResultsShowMore',
        ),
        contentTypeResultsShowLess: t(
          'masthead.menu.contentTypeResultsShowLess',
        ),
        contentTypeResultsNoHit: t('masthead.menu.contentTypeResultsNoHit'),
        compentenceGoalsToggleButtonOpen: '',
        compentenceGoalsToggleButtonClose: '',
        compentenceGoalsNarrowOpenButton: '',
        compentenceGoalsNarrowBackButton: '',
      }}
      filterOptions={filters}
      onFilterClick={onFilterClick}
      filterValues={activeFilters}
      onOpenSearch={() => onOpenSearch()}
      onNavigate={onNavigate}
      expandedTopicId={expandedTopicId}
      expandedSubtopicId={expandedSubtopicId}
      expandedSubtopicLevel2Id={expandedSubtopicLevel2Id}
      resourceToLinkProps={resourceToLinkPropsWithFilters}
      searchPageUrl={subject ? `/search/?subjects=${subject.id}` : '/search'}
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
  expandedTopicIds: arrayOf(string).isRequired,
  filters: arrayOf(object).isRequired,
  onOpenSearch: func.isRequired,
  onClose: func.isRequired,
  onFilterClick: func.isRequired,
  onNavigate: func.isRequired,
};

export default injectT(MastheadTopics);
