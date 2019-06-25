/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import {
  Masthead,
  MastheadItem,
  MastheadLanguageSelector,
  Logo,
  DisplayOnPageYOffset,
  BreadcrumbBlock,
} from '@ndla/ui';
import { injectT } from '@ndla/i18n';
import { compose } from 'redux';
import { withApollo } from 'react-apollo';
import { appLocales } from '../../i18n';
import { getUrnIdsFromProps, toBreadcrumbItems } from '../../routeHelpers';
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
import {
  getFiltersFromUrl,
  getFiltersFromUrlAsArray,
} from '../../util/filterHelper';

const getLocaleURL = (newLocale, locale, location) => {
  const { pathname, search } = location;
  const basePath = pathname.startsWith(`/${locale}/`)
    ? pathname.replace(`/${locale}/`, '/')
    : pathname;
  const newPath =
    newLocale === 'nb'
      ? `${basePath}${search}`
      : `/${newLocale}${basePath}${search}`;
  return newPath;
};

class MastheadContainer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
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
          variables: { topicId, filterIds, subjectId },
        });
      }
      if (resourceId) {
        queries.push({
          query: resourceQuery,
          variables: { resourceId, subjectId },
        });
      }

      const { data } = await runQueries(this.props.client, queries);
      const { resourceTypes, topic, subject } = data;
      const supplementaryResources =
        topic && topic.supplementaryResources
          ? topic.supplementaryResources
          : [];
      const coreResources =
        topic && topic.coreResources ? topic.coreResources : [];
      const topicResourcesByType = getResourceGroups(
        resourceTypes,
        supplementaryResources,
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

  render() {
    const { infoContent, locale, location, t, ndlaFilm } = this.props;
    const {
      data: { subject, topicPath, filters, topicResourcesByType, resource },
    } = this.state;

    const localeUrls = {};
    appLocales.forEach(appLocale => {
      localeUrls[appLocale.abbreviation] = {
        name: appLocale.name,
        url: getLocaleURL(appLocale.abbreviation, locale, location),
      };
      if (appLocale.abbreviation === 'nb') {
        localeUrls[appLocale.abbreviation].url = `/nb${
          localeUrls[appLocale.abbreviation].url
        }`;
      }
    });

    const breadcrumbBlockItems = subject
      ? toBreadcrumbItems(
          t('breadcrumb.toFrontpage'),
          [subject, ...topicPath, resource],
          getFiltersFromUrl(location),
        )
      : [];

    const showSearch = subject && !location.pathname.includes('search');
    return (
      <Masthead
        showLoaderWhenNeeded={topicPath && topicPath.length > 0}
        fixed
        ndlaFilm={ndlaFilm}
        infoContent={infoContent}>
        <MastheadItem left>
          {subject && (
            <MastheadMenu
              subject={subject}
              ndlaFilm={ndlaFilm}
              searchFieldComponent={
                showSearch && (
                  <MastheadSearch subject={subject} ndlaFilm={ndlaFilm} />
                )
              }
              topicPath={topicPath || []}
              onDataFetch={this.onDataFetch}
              filters={filters}
              resource={resource}
              topicResourcesByType={topicResourcesByType || []}
              locale={locale}
            />
          )}
          <DisplayOnPageYOffset yOffsetMin={150}>
            <BreadcrumbBlock
              items={
                breadcrumbBlockItems.length > 1
                  ? breadcrumbBlockItems.slice(1)
                  : []
              }
            />
          </DisplayOnPageYOffset>
        </MastheadItem>
        <MastheadItem right>
          <MastheadLanguageSelector
            ndlaFilm={ndlaFilm}
            options={localeUrls}
            currentLanguage={locale}
          />
          {showSearch && (
            <MastheadSearch
              subject={subject}
              locale={locale}
              ndlaFilm={ndlaFilm}
              hideOnNarrowScreen
            />
          )}
          <Logo
            to="/"
            locale={locale}
            label={t('logo.altText')}
            cssModifier={ndlaFilm ? 'white' : ''}
          />
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
  locale: PropTypes.string.isRequired,
  infoContent: PropTypes.node,
  ndlaFilm: PropTypes.bool,
};

export default compose(
  withApollo,
  injectT,
)(MastheadContainer);
