import React, { Component, Fragment } from 'react';
import { bool, shape, func, string, arrayOf, object } from 'prop-types';
import { ClickToggle, DisplayOnPageYOffset, BreadcrumbBlock } from 'ndla-ui';
import { injectT } from 'ndla-i18n';
import { withRouter } from 'react-router-dom';
import { TopicShape, ResourceShape, LocationShape } from '../../../shapes';
import { toBreadcrumbItems, getUrnIdsFromProps } from '../../../routeHelpers';
import { getSelectedTopic } from '../MastheadContainer';
import {
  getFiltersFromUrl,
  getFiltersFromUrlAsArray,
} from '../../../util/filterHelper';
import MastheadTopics from './MastheadTopics';

class MastheadMenu extends Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.location === null) {
      return {
        location: nextProps.location,
      };
    }
    const { location, topicPath } = nextProps;
    const navigated = location !== prevState.location;

    if (navigated) {
      const activeFilters = getFiltersFromUrlAsArray(location);
      return {
        expandedTopicIds: topicPath ? topicPath.map(topic => topic.id) : [],
        activeFilters,
        location,
      };
    }

    // No state update necessary
    return null;
  }

  constructor() {
    super();
    this.state = {
      activeFilters: [],
      expandedTopicIds: [],
      location: null,
    };
  }

  componentDidMount() {
    const { location, topicPath } = this.props;

    const activeFilters = getFiltersFromUrlAsArray(location);
    const expandedTopicIds = topicPath ? topicPath.map(topic => topic.id) : [];

    this.setState({
      expandedTopicIds,
      activeFilters,
    });
  }

  /*  async componentWillReceiveProps(nextProps) {
    const { location, topicPath } = nextProps;
    if (
      location.pathname !== this.props.location.pathname ||
      location.search !== this.props.location.search
    ) {
        const activeFilters = getFiltersFromUrlAsArray(location);
        this.setState({
          expandedTopicIds: topicPath.map(topic => topic.id),
          activeFilters,
        });
    }
  } */

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
    const breadcrumbBlockItems = toBreadcrumbItems(
      t('breadcrumb.toFrontpage'),
      subject,
      topicPath,
      resource,
      getFiltersFromUrl(location),
    );

    return (
      <Fragment>
        <ClickToggle
          title={t('masthead.menu.title')}
          openTitle={t('masthead.menu.close')}
          className="c-topic-menu-container"
          isOpen={isOpen}
          onToggle={toggleMenu}
          buttonClassName="c-button c-button--outline c-topic-menu-toggle-button">
          {onClose => (
            <MastheadTopics
              onClose={onClose}
              activeFilters={activeFilters}
              expandedTopicIds={expandedTopicIds}
              topicResourcesByType={topicResourcesByType}
              onOpenSearch={onOpenSearch}
              subject={subject}
              filters={filters}
              onFilterClick={this.onFilterClick}
              onNavigate={this.onNavigate}
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
      </Fragment>
    );
  }
}

MastheadMenu.propTypes = {
  isOpen: bool.isRequired,
  toggleMenu: func.isRequired,
  subject: shape({
    id: string,
    name: string,
    topics: arrayOf(object),
  }).isRequired,
  resource: ResourceShape,
  filters: arrayOf(object),
  topicResourcesByType: arrayOf(TopicShape).isRequired,
  topicPath: arrayOf(TopicShape).isRequired,
  onOpenSearch: func.isRequired,
  location: LocationShape,
  onDataFetch: func.isRequired,
};

export default injectT(withRouter(MastheadMenu));
