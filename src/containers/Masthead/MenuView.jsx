import React from 'react';
import { bool, shape, func, string, arrayOf, object } from 'prop-types';
import {
  ClickToggle,
  TopicMenu,
  DisplayOnPageYOffset,
  BreadcrumbBlock,
  ContentTypeBadge,
} from 'ndla-ui';

import { toTopic, toSubject, toSubjects } from '../../routeHelpers';
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

const MenuView = ({
  t,
  isOpen,
  toggleMenu,
  subject,
  topics,
  filters,
  activeFilters,
  expandedSubtopicId,
  expandedTopicId,
  topicResourcesByType,
  topicPath,
  onOpenSearch,
  onNavigate,
  filterClick,
  searchEnabled,
}) => {
  const getResources = expandedTopicId
    ? topicResourcesByType(expandedSubtopicId || expandedTopicId)
    : [];
  return (
    <React.Fragment>
      <ClickToggle
        title={t('masthead.menu.title')}
        openTitle={t('masthead.menu.close')}
        className="c-topic-menu-container"
        isOpen={isOpen}
        onToggle={toggleMenu}
        buttonClassName="c-btn c-button--outline c-topic-menu-toggle-button">
        <TopicMenu
          isBeta
          hideSearch={!searchEnabled}
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
            contentTypeResultsNoHit: t('masthead.menu.contentTypeResultsNoHit'),
          }}
          filterOptions={filters}
          onFilterClick={filterClick}
          filterValues={activeFilters}
          onOpenSearch={onOpenSearch}
          onNavigate={onNavigate}
          expandedTopicId={expandedTopicId}
          expandedSubtopicId={expandedSubtopicId}
          searchPageUrl={subject ? `/search/${subject.id}` : '/search'}
          contentTypeResults={mapResourcesToMenu(
            getResources,
            toTopic(subject.id, expandedTopicId, expandedSubtopicId),
          )}
        />
      </ClickToggle>
      <DisplayOnPageYOffset yOffsetMin={150}>
        <BreadcrumbBlock
          subject={subject}
          topicPath={topicPath}
          toTopic={toTopic}
        />
      </DisplayOnPageYOffset>
    </React.Fragment>
  );
};

MenuView.propTypes = {
  isOpen: bool,
  toggleMenu: func,
  subject: shape({
    id: string,
    name: string,
  }),
  topics: arrayOf(object),
  filters: arrayOf(object),
  activeFilters: arrayOf(string),
  expandedSubtopicId: string,
  expandedTopicId: string,
  topicResourcesByType: func,
  topicPath: arrayOf(string),
  onOpenSearch: func,
  onNavigate: func,
  filterClick: func,
  searchEnabled: bool,
};

export default MenuView;
