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
  toSubject,
  toBreadcrumbItems,
  getUrnIdsFromProps,
} from '../../routeHelpers';
import { resourceToLinkProps } from '../Resources/resourceHelpers';
import { getSelectedTopic } from './MastheadContainer';
import {
  getFiltersFromUrl,
  getFiltersFromUrlAsArray,
} from '../../util/filterHelper';
import {
  mapTopicResourcesToTopic,
  toTopicWithSubjectIdBound,
} from './mastheadHelpers';

class MenuView extends React.Component {
  constructor() {
    super();
    this.state = {
      activeFilters: [],
      expandedTopicIds: [],
    };
  }

  async componentDidMount() {
    const { location, topicPath, subject } = this.props;

    if (subject && subject.id) {
      const activeFilters = getFiltersFromUrlAsArray(location);
      const expandedTopicIds = topicPath
        ? topicPath.map(topic => topic.id)
        : [];

      this.setState({
        expandedTopicIds,
        activeFilters,
      });
    }
  }

  async componentWillReceiveProps(nextProps) {
    const { location, subject, topicPath } = nextProps;
    if (
      location.pathname !== this.props.location.pathname ||
      location.search !== this.props.location.search
    ) {
      if (subject && subject.id) {
        const activeFilters = getFiltersFromUrlAsArray(location);
        this.setState({
          expandedTopicIds: topicPath.map(topic => topic.id),
          activeFilters,
        });
      }
    }
  }

  onFilterClick = activeFilters => {
    const { onDataFetch } = this.props;
    const { subjectId, topicId, resourceId } = getUrnIdsFromProps(this.props);
    this.setState({ activeFilters });
    onDataFetch(subjectId, topicId, resourceId, activeFilters);
  };

  onNavigate = async (...expandedTopicIds) => {
    const { onDataFetch } = this.props;

    this.setState({ expandedTopicIds });
    const selectedTopicId = getSelectedTopic(expandedTopicIds);
    if (selectedTopicId) {
      const { subjectId, resourceId } = getUrnIdsFromProps(this.props);
      onDataFetch(
        subjectId,
        selectedTopicId,
        resourceId,
        this.state.activeFilters,
      );
    }
  };

  render() {
    const {
      t,
      isOpen,
      toggleMenu,
      subject,
      filters,
      topicResourcesByType,
      topicPath,
      onOpenSearch,
      resource,
      location,
    } = this.props;

    const { activeFilters, expandedTopicIds } = this.state;

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
              onFilterClick={this.onFilterClick}
              filterValues={activeFilters}
              onOpenSearch={() => onOpenSearch()}
              onNavigate={this.onNavigate}
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
              breadcrumbBlockItems.length > 1
                ? breadcrumbBlockItems.slice(1)
                : []
            }
          />
        </DisplayOnPageYOffset>
      </React.Fragment>
    );
  }
}

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
  topicResourcesByType: arrayOf(TopicShape).isRequired,
  topicPath: arrayOf(TopicShape).isRequired,
  onOpenSearch: func.isRequired,
  location: LocationShape,
  onDataFetch: func.isRequired,
};

export default withRouter(MenuView);
