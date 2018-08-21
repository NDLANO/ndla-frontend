/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Masthead, MastheadItem, Logo } from 'ndla-ui';
import { compose } from 'redux';
import { withApollo } from 'react-apollo';
import { getUrnIdsFromProps } from '../../routeHelpers';
import { getTopicPath } from '../../util/getTopicPath';
import { LocationShape } from '../../shapes';
import MastheadSearch from './components/MastheadSearch';
import MastheadMenu from './components/MastheadMenu';
import {
  topicResourcesQuery,
  resourceTypesQuery,
  resourceQuery,
  subjectTopicsQuery,
} from '../../queries';
import { getResourceGroups } from '../Resources/getResourceGroups';
import { runQueries } from '../../util/runQueries';
import handleError from '../../util/handleError';
import { toTopicMenu } from '../../util/topicsHelper';
import { getFiltersFromUrlAsArray } from '../../util/filterHelper';

class MastheadContainer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      menuIsOpen: false,
      searchIsOpen: false,
      data: {},
    };
  }

  async componentDidMount() {
    const { location } = this.props;
    const { subjectId, resourceId, topicId } = getUrnIdsFromProps(this.props);

    if (subjectId) {
      const activeFilters = getFiltersFromUrlAsArray(location);
      const data = await this.getData(
        subjectId,
        topicId,
        resourceId,
        activeFilters,
      );

      this.setState({
        data,
      });
    }
  }

  async componentWillReceiveProps(nextProps) {
    const { location } = nextProps;
    if (
      location.pathname !== this.props.location.pathname ||
      location.search !== this.props.location.search
    ) {
      const { subjectId, resourceId, topicId } = getUrnIdsFromProps(nextProps);
      if (subjectId) {
        const activeFilters = getFiltersFromUrlAsArray(location);
        const data = await this.getData(
          subjectId,
          topicId,
          resourceId,
          activeFilters,
        );
        this.setState({
          data,
        });
      }
    }
  }

  onDataFetch = async (subjectId, topicId, resourceId, filters = []) => {
    this.setState(prevState => ({
      data: {
        ...prevState.data,
        topicResourcesByType: [],
      },
    }));
    const data = await this.getData(subjectId, topicId, resourceId, filters);
    this.setState({ data });
  };

  onOpenSearch = () => {
    this.setState({
      menuIsOpen: false,
      searchIsOpen: true,
    });
  };

  getData = async (subjectId, topicId, resourceId, activeFilters = []) => {
    const filterIds = activeFilters.join(',');

    try {
      const queries = [];
      if (subjectId) {
        queries.push({ query: resourceTypesQuery });
        queries.push({
          query: subjectTopicsQuery,
          variables: { subjectId, filterIds },
        });
      }
      if (topicId) {
        queries.push({
          query: topicResourcesQuery,
          variables: { topicId, filterIds },
        });
      }
      if (resourceId) {
        queries.push({
          query: resourceQuery,
          variables: { resourceId },
        });
      }

      const { data } = await runQueries(this.props.client, queries);
      const { resourceTypes, topic, subject } = data;
      const coreResources =
        topic && topic.coreResources ? topic.coreResources : [];
      const topicResourcesByType = getResourceGroups(
        resourceTypes,
        [],
        coreResources,
      );
      const topicPath =
        subject && subject.topics
          ? getTopicPath(subjectId, topicId, subject.topics)
          : [];

      const filters =
        subject && subject.filters
          ? subject.filters.map(filter => ({
              ...filter,
              title: filter.name,
              value: filter.id,
            }))
          : [];

      const topicsWithSubTopics =
        subject && subject.topics
          ? subject.topics
              .filter(t => !t.parent || t.parent === subjectId)
              .map(t => toTopicMenu(t, subject.topics))
          : [];

      return {
        filters,
        resource: data.resource,
        topicResourcesByType,
        topicPath,
        subject: {
          ...subject,
          topics: topicsWithSubTopics,
        },
      };
    } catch (e) {
      handleError(e);
      return { error: true };
    }
  };

  toggleField = (field, isOpen) => {
    this.setState({ [field]: isOpen });
  };

  render() {
    const {
      data: { subject, topicPath, filters, topicResourcesByType, resource },
      searchIsOpen,
      menuIsOpen,
    } = this.state;
    return (
      <Masthead fixed>
        <MastheadItem left>
          {subject && (
            <MastheadMenu
              subject={subject}
              topicPath={topicPath || []}
              toggleMenu={isOpen => this.toggleField('menuIsOpen', isOpen)}
              onOpenSearch={this.onOpenSearch}
              onDataFetch={this.onDataFetch}
              filters={filters}
              menuIsOpen={menuIsOpen}
              resource={resource}
              topicResourcesByType={topicResourcesByType || []}
            />
          )}
        </MastheadItem>
        <MastheadItem right>
          {subject && (
            <MastheadSearch
              searchIsOpen={searchIsOpen}
              openToggle={isOpen => this.toggleField('searchIsOpen', isOpen)}
              subject={subject}
            />
          )}
          <Logo to="/" label="Nasjonal digital læringsarena" />
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
  location: LocationShape,
  client: PropTypes.shape({ query: PropTypes.func.isRequired }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default compose(withApollo)(MastheadContainer);
