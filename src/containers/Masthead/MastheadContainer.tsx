/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState, useEffect, useContext } from 'react';
import {
  Masthead,
  MastheadItem,
  LanguageSelector,
  Logo,
  DisplayOnPageYOffset,
  HeaderBreadcrumb,
} from '@ndla/ui';
import styled from '@emotion/styled';
import { breakpoints, mq, spacing } from '@ndla/core';
import { useLocation } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';

import { Feide } from '@ndla/icons/common';
import { useTranslation } from 'react-i18next';
import {
  toBreadcrumbItems,
  useIsNdlaFilm,
  useUrnIds,
} from '../../routeHelpers';

import FeideLoginButton from '../../components/FeideLoginButton';
import MastheadSearch from './components/MastheadSearch';
import MastheadMenu from './components/MastheadMenu';
import { mastHeadQuery } from '../../queries';
import { getLocaleUrls } from '../../util/localeHelpers';
import ErrorBoundary from '../ErrorPage/ErrorBoundary';
import { mapMastheadData } from './mastheadHelpers';
import {
  GQLMastHeadQuery,
  GQLMastHeadQueryVariables,
  GQLResourceType,
  GQLSubjectInfoFragment,
  GQLTopicInfoFragment,
} from '../../graphqlTypes';
import config from '../../config';
import { useAlerts } from '../../components/AlertsContext';
import { SKIP_TO_CONTENT_ID } from '../../constants';
import MastheadMenuModal from './components/MastheadMenuModal';
import { AuthContext } from '../../components/AuthenticationContext';
import { getSubjectsCategories } from '../../data/subjects';

const BreadcrumbWrapper = styled.div`
  margin-left: ${spacing.normal};
  ${mq.range({ until: breakpoints.desktop })} {
    display: none;
  }
`;

const FeideLoginLabel = styled.span`
  ${mq.range({ until: breakpoints.mobileWide })} {
    display: none;
  }
`;

interface State {
  subject?: GQLMastHeadQuery['subject'];
  subjects?: GQLSubjectInfoFragment[];
  topicPath?: GQLTopicInfoFragment[];
  topicResourcesByType?: GQLResourceType[];
  resource?: GQLMastHeadQuery['resource'];
}

const initialState: State = { topicPath: [] };

const MastheadContainer = () => {
  const [state, setState] = useState<State>(initialState);
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const {
    subjectId: subjectIdParam,
    resourceId,
    topicId: topicIdParam,
    subjectType,
  } = useUrnIds();
  const [topicId, setTopicId] = useState<string>(topicIdParam ?? '');
  const [subjectId, setSubjectId] = useState<string>(subjectIdParam ?? '');
  const { user } = useContext(AuthContext);
  const { openAlerts, closeAlert } = useAlerts();
  const location = useLocation();
  const ndlaFilm = useIsNdlaFilm();
  const hideBreadcrumb = subjectType === 'standard' && !resourceId;

  const [fetchData] = useLazyQuery<GQLMastHeadQuery, GQLMastHeadQueryVariables>(
    mastHeadQuery,
    {
      errorPolicy: 'ignore',
      onCompleted: data =>
        setState(mapMastheadData({ subjectId, topicId, data })),
    },
  );

  useEffect(() => {
    setTopicId(topicIdParam ?? '');
  }, [topicIdParam]);

  useEffect(() => {
    setSubjectId(subjectIdParam ?? '');
  }, [subjectIdParam]);

  useEffect(() => {
    if (!subjectId) {
      setState(initialState);
      return;
    }
    fetchData({
      variables: {
        subjectId: subjectId ?? '',
        topicId: topicId ?? '',
        resourceId: resourceId ?? '',
        skipTopic: !topicId,
        skipResource: !resourceId,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicId, resourceId, subjectId]);

  const {
    subject,
    topicPath = [],
    topicResourcesByType,
    resource,
    subjects,
  } = state;

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
    location.pathname !== '/' &&
    (location.pathname.includes('utdanning') || subject) && (
      <MastheadSearch
        subject={subject}
        hideOnNarrowScreen={hideOnNarrowScreen}
      />
    );

  const alerts = openAlerts?.map(alert => ({
    content: alert.body || alert.title,
    closable: alert.closable,
    number: alert.number,
  }));

  return (
    <ErrorBoundary>
      <Masthead
        fixed
        ndlaFilm={ndlaFilm}
        skipToMainContentId={SKIP_TO_CONTENT_ID}
        onCloseAlert={id => closeAlert(id)}
        messages={alerts}>
        <MastheadItem left>
          <MastheadMenuModal>
            {(onClose: () => void) => (
              <MastheadMenu
                locale={locale}
                subject={subject}
                topicResourcesByType={topicResourcesByType ?? []}
                subjectCategories={getSubjectsCategories(t, subjects)}
                onTopicChange={newId => setTopicId(newId)}
                close={onClose}
              />
            )}
          </MastheadMenuModal>
          {!hideBreadcrumb && !!breadcrumbBlockItems.length && (
            <DisplayOnPageYOffset yOffsetMin={150}>
              <BreadcrumbWrapper>
                <HeaderBreadcrumb
                  light={ndlaFilm}
                  items={
                    breadcrumbBlockItems.length > 1
                      ? breadcrumbBlockItems
                          .slice(1)
                          .map(uri => ({ name: uri.name!, to: uri.to! }))
                      : []
                  }
                />
              </BreadcrumbWrapper>
            </DisplayOnPageYOffset>
          )}
        </MastheadItem>
        <MastheadItem right>
          <LanguageSelector
            inverted={ndlaFilm}
            options={getLocaleUrls(locale, location)}
            currentLanguage={i18n.language}
          />
          {config.feideEnabled && (
            <FeideLoginButton masthead>
              <FeideLoginLabel data-hj-suppress>
                {user?.givenName ? (
                  <span data-hj-suppress>{user.givenName}</span>
                ) : (
                  <span>{t('myNdla.myNDLA')}</span>
                )}
              </FeideLoginLabel>
              <Feide />
            </FeideLoginButton>
          )}
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
