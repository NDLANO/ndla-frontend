/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState, useEffect } from 'react';
import {
  //@ts-ignore
  Masthead,
  //@ts-ignore
  MastheadItem,
  LanguageSelector,
  //@ts-ignore
  Logo,
  //@ts-ignore
  DisplayOnPageYOffset,
  BreadcrumbBlock,
} from '@ndla/ui';
import { RouteComponentProps } from 'react-router';
import { useLazyQuery } from '@apollo/client';

import { Feide } from '@ndla/icons/common';
import { useTranslation } from 'react-i18next';
import { getUrnIdsFromProps, toBreadcrumbItems } from '../../routeHelpers';

import FeideLoginButton from '../../components/FeideLoginButton';
import MastheadSearch from './components/MastheadSearch';
import MastheadMenu from './components/MastheadMenu';
import { mastHeadQuery } from '../../queries';
import { getLocaleUrls } from '../../util/localeHelpers';
import ErrorBoundary from '../ErrorPage/ErrorBoundary';
import { mapMastheadData } from './mastheadHelpers';
import {
  getCategorizedSubjects,
  getProgrammes,
} from '../../util/programmesSubjectsHelper';
import { LocaleType } from '../../interfaces';
import {
  GQLMastheadQueryData,
  GQLResource,
  GQLResourceType,
  GQLSubject,
  GQLTopic,
} from '../../graphqlTypes';

interface Props extends RouteComponentProps {
  locale: LocaleType;
  infoContent?: React.ReactNode;
  ndlaFilm?: boolean;
  skipToMainContentId?: string;
  hideBreadcrumb?: boolean;
}

interface State {
  subject?: GQLSubject;
  topicPath?: GQLTopic[];
  topicResourcesByType?: GQLResourceType[];
  resource?: GQLResource;
}

const MastheadContainer = ({
  infoContent,
  locale,
  location,
  ndlaFilm,
  match,
  skipToMainContentId,
  hideBreadcrumb,
}: Props) => {
  const [subjectId, setSubjectId] = useState('');
  const [topicId, setTopicId] = useState('');
  const [state, setState] = useState<State>({});
  const { t, i18n } = useTranslation();

  useEffect(() => {
    updateData();
  }, [location.pathname, location.search]); // eslint-disable-line react-hooks/exhaustive-deps

  const [fetchData, { data }] = useLazyQuery<GQLMastheadQueryData>(
    mastHeadQuery,
  );

  useEffect(() => {
    // we set data in state to prevent it from disappearing in view when we refecth
    if (data) {
      const stateData = mapMastheadData({ subjectId, topicId, data });
      setState(stateData);
    }
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateData = () => {
    const { subjectId, resourceId, topicId } = getUrnIdsFromProps({
      ndlaFilm,
      match,
    });
    if (subjectId) {
      getData(subjectId, topicId, resourceId);
    }
  };

  const onDataFetch = (
    subjectId: string,
    topicId?: string,
    resourceId?: string,
  ) => {
    getData(subjectId, topicId, resourceId);
  };

  const getData = (subjectId: string, topicId = '', resourceId = '') => {
    setSubjectId(subjectId);
    if (topicId) {
      setTopicId(topicId);
    }
    fetchData({
      variables: {
        subjectId,
        topicId,
        resourceId,
        skipTopic: !topicId,
        skipResource: !resourceId,
      },
    });
  };

  const { subject, topicPath, topicResourcesByType, resource } = state;
  const path = topicPath ?? [];

  const breadcrumbBlockItems = (subject?.id
    ? toBreadcrumbItems(t('breadcrumb.toFrontpage'), [
        subject,
        ...path,
        ...(resource ? [resource] : []),
      ])
    : []
  ).filter(uri => !!uri.name && !!uri.to);

  const renderSearchComponent = (hideOnNarrowScreen: boolean) =>
    !location.pathname.includes('search') &&
    (location.pathname.includes('utdanning') || subject) && (
      <MastheadSearch
        subject={subject}
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
                    ? breadcrumbBlockItems
                        .slice(1)
                        .map(uri => ({ name: uri.name!, to: uri.to! }))
                    : []
                }>
                {/* Requires a child */}
                <></>
              </BreadcrumbBlock>
            </DisplayOnPageYOffset>
          )}
        </MastheadItem>
        <MastheadItem right>
          <LanguageSelector
            inverted={ndlaFilm}
            //@ts-ignore
            options={getLocaleUrls(locale, location)}
            currentLanguage={i18n.language}
          />
          <FeideLoginButton>
            <Feide />
          </FeideLoginButton>
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

export default MastheadContainer;
