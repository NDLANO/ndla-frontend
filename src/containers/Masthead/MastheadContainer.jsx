/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Masthead, MastheadItem, Logo, ContentTypeBadge } from 'ndla-ui';
import Link from 'react-router-dom/Link';
import { injectT } from 'ndla-i18n';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { getUrnIdsFromProps } from '../../routeHelpers';
import { getSubjectById } from '../SubjectPage/subjects';
import { getSubjectMenu, getTopicPath } from '../TopicPage/topic';
import {
  actions as filterActions,
  getActiveFilter,
  getFilters,
} from '../Filters/filter';
import { getFilterState, getGroupResults } from '../SearchPage/searchSelectors';
import * as searchActions from '../SearchPage/searchActions';
import { SubjectShape, TopicShape } from '../../shapes';
import { actions, getResourceTypesByTopicId } from '../Resources/resource';

import SearchButtonView from './SearchButtonView';
import MenuView from './MenuView';

const initialState = {
  isOpen: false,
  searchIsOpen: false,
  expandedTopicId: undefined,
  expandedSubtopicId: undefined,
};
class MastheadContainer extends React.PureComponent {
  state = initialState;

  componentDidMount() {
    const { subjectId } = getUrnIdsFromProps(this.props);
    if (subjectId && this.props.filters.length === 0) {
      this.props.fetchSubjectFilters(subjectId);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.pathname !== this.props.location.pathname) {
      this.setState(initialState); // reset on location change

      // remove active topic if filtered away
    } else if (
      nextProps.activeFilters.length !== this.props.activeFilters.length
    ) {
      const { expandedTopicId, expandedSubtopicId } = this.state;
      if (nextProps.topics.indexOf(expandedTopicId) === -1) {
        this.setState({ expandedTopicId: undefined });
      }
      if (this.props.topics.indexOf(expandedSubtopicId) === -1) {
        this.setState({ expandedSubtopicId: undefined });
      }
    }

    if (nextProps.filterState.query !== this.props.filterState.query) {
      this.props.search(nextProps.filterState.query);
    }
  }

  onNavigate = (expandedTopicId, expandedSubtopicId) => {
    const { subjectId } = getUrnIdsFromProps(this.props);
    this.setState({
      expandedTopicId,
      expandedSubtopicId,
    });
    const newTopic = expandedSubtopicId || expandedTopicId;
    if (newTopic) {
      this.props.fetchTopicResources({ topicId: newTopic, subjectId });
    }
  };

  filterClick = (newValues, filterId) =>
    this.props.setActiveFilter({
      newValues,
      subjectId: this.props.subject.id,
      filterId,
    });

  render() {
    const {
      t,
      subject,
      updateFilter,
      filterState,
      results,
      location,
      ...props
    } = this.props;
    const resultsMapped = results.map(it => ({
      ...it,
      title: t(`contentTypes.${it.resourceType}`),
      showAllLinkUrl: `/search/?resourceType=${it.resourceType}`,
    }));
    return (
      <Masthead
        infoContent={
          <span>
            {t(`masthead.menu.${subject ? 'betaInfo' : 'betaInfoFront'}`)}
            {subject && <Link to="/">{t('masthead.menu.readMore')}</Link>}
          </span>
        }
        fixed>
        <MastheadItem left>
          {subject ? (
            <MenuView
              subject={subject}
              t={t}
              filterClick={this.filterClick}
              toggleMenu={bool => this.setState({ isOpen: bool })}
              onNavigate={this.onNavigate}
              onOpenSearch={() => {
                this.setState({
                  isOpen: false,
                  searchIsOpen: true,
                });
              }}
              {...this.state}
              {...props}
            />
          ) : null}
        </MastheadItem>
        <MastheadItem right>
          {!location.pathname.includes('search') && (
            <SearchButtonView
              isOpen={this.state.searchIsOpen}
              openToggle={isOpen => {
                this.setState({
                  searchIsOpen: isOpen,
                });
              }}
              {...{
                subject,
                updateFilter,
                filterState,
                results: resultsMapped,
              }}
            />
          )}
          <Logo isBeta to="/" altText="Nasjonal digital læringsarena" />
        </MastheadItem>
      </Masthead>
    );
  }
}

MastheadContainer.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      subjectId: PropTypes.string,
      topicId: PropTypes.string,
    }).isRequired,
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }),
  t: PropTypes.func.isRequired,
  subject: SubjectShape,
  topics: PropTypes.arrayOf(TopicShape).isRequired,
  topicPath: PropTypes.arrayOf(TopicShape),
  filters: PropTypes.arrayOf(PropTypes.object).isRequired,
  setActiveFilter: PropTypes.func.isRequired,
  activeFilters: PropTypes.arrayOf(PropTypes.string).isRequired,
  topicResourcesByType: PropTypes.func.isRequired,
  fetchTopicResources: PropTypes.func.isRequired,
  fetchSubjectFilters: PropTypes.func.isRequired,
  results: PropTypes.arrayOf(PropTypes.object),
  filterState: PropTypes.shape({
    query: PropTypes.string,
  }),
  updateFilter: PropTypes.func,
};

const mapDispatchToProps = {
  fetchTopicResources: actions.fetchTopicResources,
  setActiveFilter: filterActions.setActive,
  fetchSubjectFilters: filterActions.fetchSubjectFilters,
  updateFilter: searchActions.updateFilter,
  search: searchActions.groupSearch,
};

const mapStateToProps = (state, ownProps) => {
  const { subjectId, topicId } = getUrnIdsFromProps(ownProps);
  return {
    subject: getSubjectById(subjectId)(state),
    topics: getSubjectMenu(subjectId)(state),
    topicResourcesByType: topic => getResourceTypesByTopicId(topic)(state),
    topicPath: getTopicPath(subjectId, topicId)(state),
    filters: getFilters(subjectId)(state),
    activeFilters: getActiveFilter(subjectId)(state) || [],
    filterState: getFilterState(state),
    results: getGroupResults(state),
  };
};

export default compose(injectT, connect(mapStateToProps, mapDispatchToProps))(
  MastheadContainer,
);
