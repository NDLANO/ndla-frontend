import React from 'react';
import { bool, shape, func, string, arrayOf, object } from 'prop-types';
import {
  ClickToggle,
  TopicMenu,
  DisplayOnPageYOffset,
  BreadcrumbBlock,
  ContentTypeBadge,
} from 'ndla-ui';
import { TopicShape } from '../../shapes';
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
  expandedTopicIds,
  topicResourcesByType,
  topicPath,
  onOpenSearch,
  onNavigate,
  filterClick,
  searchEnabled,
}) => {
  const [
    expandedTopicId,
    expandedSubtopicId,
    expandedSubtopicLevel2Id,
  ] = expandedTopicIds;
  const getResources = expandedTopicId ? topicResourcesByType : [];

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
          hideSearch={!searchEnabled}
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
            contentTypeResultsNoHit: t('masthead.menu.contentTypeResultsNoHit'),
          }}
          filterOptions={filters}
          onFilterClick={filterClick}
          filterValues={activeFilters}
          onOpenSearch={() => onOpenSearch}
          onNavigate={onNavigate}
          expandedTopicId={expandedTopicId}
          expandedSubtopicId={expandedSubtopicId}
          expandedSubtopicLevel2Id={expandedSubtopicLevel2Id}
          searchPageUrl={
            subject ? `/search/?subjects=${subject.id}` : '/search'
          }
          contentTypeResults={mapResourcesToMenu(
            getResources,
            toTopic(subject.id, expandedTopicId, expandedSubtopicId),
          )}
        />
      </ClickToggle>
      <DisplayOnPageYOffset yOffsetMin={150}>
        <BreadcrumbBlock
          items={[
            {
              name: subject.name,
              to: toTopic(subject.id, expandedTopicId, expandedSubtopicId),
            },
          ]}
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
  expandedTopicIds: arrayOf(string),
  topicResourcesByType: arrayOf(TopicShape).isRequired,
  topicPath: arrayOf(string),
  onOpenSearch: func,
  onNavigate: func,
  filterClick: func,
  searchEnabled: bool,
};

export default MenuView;
