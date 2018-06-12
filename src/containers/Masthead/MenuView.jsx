import React from 'react';
import { bool, shape, func, string, arrayOf, object } from 'prop-types';
import {
  ClickToggle,
  TopicMenu,
  DisplayOnPageYOffset,
  BreadcrumbBlock,
} from 'ndla-ui';
import { withRouter } from 'react-router-dom';
import { TopicShape, ResourceShape, LocationShape } from '../../shapes';
import {
  toTopic,
  toSubject,
  toSubjects,
  toBreadcrumbItems,
} from '../../routeHelpers';
import { resourceToLinkProps } from '../Resources/resourceHelpers';
import { getSelectedTopic } from './MastheadContainer';
import { getFiltersFromUrl } from '../../util/filterHelper';

function toTopicWithSubjectIdBound(subjectId) {
  return toTopic.bind(undefined, subjectId);
}

function mapTopicResourcesToTopic(
  topics,
  selectedTopicId,
  topicResourcesByType,
) {
  return topics.map(topic => {
    if (topic.id === selectedTopicId) {
      const contentTypeResults = topicResourcesByType.map(type => ({
        resources: type.resources
          .map(resource => ({
            ...resource,
            path: toSubjects() + resource.path,
          }))
          .filter(resource => !resource.additional),
        title: type.name,
      }));
      return { ...topic, contentTypeResults };
    } else if (topic.subtopics && topic.subtopics.length > 0) {
      return {
        ...topic,
        subtopics: mapTopicResourcesToTopic(
          topic.subtopics,
          selectedTopicId,
          topicResourcesByType,
        ),
      };
    }
    return topic;
  });
}

const MenuView = ({
  t,
  isOpen,
  toggleMenu,
  subject,
  filters,
  activeFilters,
  expandedTopicIds,
  topicResourcesByType,
  topicPath,
  onOpenSearch,
  onNavigate,
  filterClick,
  resource,
  location,
}) => {
  const [
    expandedTopicId,
    expandedSubtopicId,
    expandedSubtopicLevel2Id,
  ] = expandedTopicIds;

  const topicsWithContentTypes = mapTopicResourcesToTopic(
    subject.topics,
    getSelectedTopic(expandedTopicIds),
    topicResourcesByType,
  );

  const breadcrumbBlockItems = toBreadcrumbItems(
    t('breadcrumb.toFrontpage'),
    subject,
    topicPath,
    resource,
    getFiltersFromUrl(location),
  );

  return (
    <React.Fragment>
      <ClickToggle
        title={t('masthead.menu.title')}
        openTitle={t('masthead.menu.close')}
        className="c-topic-menu-container"
        isOpen={isOpen}
        onToggle={toggleMenu}
        buttonClassName="c-btn c-button--outline c-topic-menu-toggle-button">
        {onClose => (
          <TopicMenu
            close={onClose}
            isBeta
            toSubject={() => toSubject(subject.id)}
            subjectTitle={subject.name}
            toTopic={toTopicWithSubjectIdBound(subject.id)}
            topics={topicsWithContentTypes}
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
              compentenceGoalsToggleButtonOpen: '',
              compentenceGoalsToggleButtonClose: '',
              compentenceGoalsNarrowOpenButton: '',
              compentenceGoalsNarrowBackButton: '',
            }}
            filterOptions={filters}
            onFilterClick={filterClick}
            filterValues={activeFilters}
            onOpenSearch={() => onOpenSearch()}
            onNavigate={onNavigate}
            expandedTopicId={expandedTopicId}
            expandedSubtopicId={expandedSubtopicId}
            expandedSubtopicLevel2Id={expandedSubtopicLevel2Id}
            resourceToLinkProps={resourceToLinkProps}
            searchPageUrl={
              subject ? `/search/?subjects=${subject.id}` : '/search'
            }
          />
        )}
      </ClickToggle>
      <DisplayOnPageYOffset yOffsetMin={150}>
        <BreadcrumbBlock
          items={
            breadcrumbBlockItems.length > 1 ? breadcrumbBlockItems.slice(1) : []
          }
        />
      </DisplayOnPageYOffset>
    </React.Fragment>
  );
};

MenuView.propTypes = {
  isOpen: bool.isRequired,
  toggleMenu: func.isRequired,
  subject: shape({
    id: string,
    name: string,
    topics: arrayOf(object),
  }).isRequired,
  resource: ResourceShape,
  filters: arrayOf(object).isRequired,
  activeFilters: arrayOf(string).isRequired,
  expandedTopicIds: arrayOf(string).isRequired,
  topicResourcesByType: arrayOf(TopicShape).isRequired,
  topicPath: arrayOf(TopicShape).isRequired,
  onOpenSearch: func.isRequired,
  onNavigate: func.isRequired,
  filterClick: func.isRequired,
  location: LocationShape,
};

export default withRouter(MenuView);
