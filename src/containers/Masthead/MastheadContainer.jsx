/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Masthead,
  MastheadItem,
  LanguageSelector,
  Logo,
  DisplayOnPageYOffset,
  BreadcrumbBlock,
} from '@ndla/ui';
import { injectT } from '@ndla/i18n';
import { useLazyQuery } from '@apollo/client';
import { getUrnIdsFromProps, toBreadcrumbItems } from '../../routeHelpers';
import { LocationShape } from '../../shapes';
import MastheadSearch from './components/MastheadSearch';
import MastheadMenu from './components/MastheadMenu';
import { mastHeadQuery } from '../../queries';
import {
  getFiltersFromUrl,
  getFiltersFromUrlAsArray,
} from '../../util/filterHelper';
import { getLocaleUrls } from '../../util/localeHelpers';
import ErrorBoundary from '../ErrorPage/ErrorBoundary';
import { mapMastheadData } from './mastheadHelpers';
import {
  getCategorizedSubjects,
  getProgrammes,
} from '../../util/programmesSubjectsHelper';

const MastheadContainer = ({
  infoContent,
  locale,
  location,
  t,
  ndlaFilm,
  match,
  skipToMainContentId,
  hideBreadcrumb,
}) => {
  const [subjectId, setSubjectId] = useState('');
  const [topicId, setTopicId] = useState('');
  const [state, setState] = useState({});

  useEffect(() => {
    updateData();
  }, [location.pathname, location.search]); // eslint-disable-line react-hooks/exhaustive-deps

  const [fetchData, { data }] = useLazyQuery(mastHeadQuery);

  useEffect(() => {
    // we set data in state to prevent it from disappearing in view when we refecth
    if (data) {
      setState(
        mapMastheadData({
          subjectId,
          topicId,
          data,
        }),
      );
    }
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateData = () => {
    const { subjectId, resourceId, topicId } = getUrnIdsFromProps({
      ndlaFilm,
      match,
    });
    if (subjectId) {
      const activeFilters = getFiltersFromUrlAsArray(location);
      getData(subjectId, topicId, resourceId, activeFilters);
    }
  };

  const onDataFetch = (subjectId, topicId, resourceId, filters = []) => {
    getData(subjectId, topicId, resourceId, filters);
  };

  const getData = (
    subjectId,
    topicId = '',
    resourceId = '',
    activeFilters = [],
  ) => {
    const filterIds = activeFilters.join(',');
    if (subjectId) {
      setSubjectId(subjectId);
    }
    if (topicId) {
      setTopicId(topicId);
    }
    fetchData({
      variables: {
        subjectId,
        filterIds,
        topicId,
        resourceId,
        skipTopic: !topicId,
        skipResource: !resourceId,
      },
    });
  };

  const {
    subject,
    topicPath = [],
    filters,
    topicResourcesByType,
    resource,
  } = state;

  const filterIds = getFiltersFromUrl(location);
  const breadcrumbBlockItems = subject?.id
    ? toBreadcrumbItems(
        t('breadcrumb.toFrontpage'),
        [subject, ...topicPath, resource],
        filterIds,
      )
    : [];

  const renderSearchComponent = hideOnNarrowScreen =>
    !location.pathname.includes('search') &&
    (location.pathname.includes('utdanning') || subject) && (
      <MastheadSearch
        subject={subject}
        filterIds={filterIds}
        ndlaFilm={ndlaFilm}
        hideOnNarrowScreen={hideOnNarrowScreen}
      />
    );
  return (
    <ErrorBoundary>
      <Masthead
        fixed
        ndlaFilm={ndlaFilm}
        skipToMainContentId={skipToMainContentId}
        infoContent={infoContent}>
        <MastheadItem left>
          {subject?.id && (
            <MastheadMenu
              subject={subject}
              ndlaFilm={ndlaFilm}
              searchFieldComponent={renderSearchComponent(false)}
              topicPath={topicPath || []}
              onDataFetch={onDataFetch}
              filters={filters}
              resource={resource}
              topicResourcesByType={topicResourcesByType || []}
              locale={locale}
              programmes={getProgrammes(locale)}
              subjectCategories={getCategorizedSubjects(locale)}
            />
          )}
          {!hideBreadcrumb && (
            <DisplayOnPageYOffset yOffsetMin={150}>
              <BreadcrumbBlock
                items={
                  breadcrumbBlockItems.length > 1
                    ? breadcrumbBlockItems.slice(1)
                    : []
                }
              />
            </DisplayOnPageYOffset>
          )}
        </MastheadItem>
        <MastheadItem right>
          <LanguageSelector
            inverted={ndlaFilm}
            options={getLocaleUrls(locale, location)}
            currentLanguage={locale}
          />
          {renderSearchComponent(true)}
          <Logo
            to="/"
            locale={locale}
            label={t('logo.altText')}
            cssModifier={ndlaFilm ? 'white' : ''}
          />
        </MastheadItem>
      </Masthead>
    </ErrorBoundary>
  );
};

MastheadContainer.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      subjectId: PropTypes.string,
      topicId: PropTypes.string,
    }).isRequired,
  }).isRequired,
  location: LocationShape,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  locale: PropTypes.string.isRequired,
  infoContent: PropTypes.node,
  ndlaFilm: PropTypes.bool,
  skipToMainContentId: PropTypes.string.isRequired,
  hideBreadcrumb: PropTypes.bool,
};

export default injectT(MastheadContainer);
