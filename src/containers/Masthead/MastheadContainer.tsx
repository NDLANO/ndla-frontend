/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext, useMemo } from 'react';
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
import keyBy from 'lodash/keyBy';
import { gql } from '@apollo/client';

import { Feide } from '@ndla/icons/common';
import { useTranslation } from 'react-i18next';
import {
  toBreadcrumbItems,
  useIsNdlaFilm,
  useUrnIds,
} from '../../routeHelpers';

import FeideLoginButton from '../../components/FeideLoginButton';
import MastheadSearch from './components/MastheadSearch';
import ErrorBoundary from '../ErrorPage/ErrorBoundary';
import config from '../../config';
import { useAlerts } from '../../components/AlertsContext';
import { SKIP_TO_CONTENT_ID } from '../../constants';
import { AuthContext } from '../../components/AuthenticationContext';
import MastheadDrawer from './drawer/MastheadDrawer';
import { useGraphQuery } from '../../util/runQueries';
import {
  GQLMastHeadQuery,
  GQLMastHeadQueryVariables,
} from '../../graphqlTypes';
import { supportedLanguages } from '../../i18n';

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

const mastheadQuery = gql`
  query mastHead(
    $subjectId: String!
    $resourceId: String!
    $skipResource: Boolean!
  ) {
    subject(id: $subjectId) {
      ...MastheadDrawer_Subject
    }
    resource(id: $resourceId) @skip(if: $skipResource) {
      id
      name
    }
  }
  ${MastheadDrawer.fragments.subject}
`;

const MastheadContainer = () => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const { subjectId, resourceId, subjectType, topicList } = useUrnIds();
  const { user } = useContext(AuthContext);
  const { openAlerts, closeAlert } = useAlerts();
  const location = useLocation();
  const ndlaFilm = useIsNdlaFilm();
  const hideBreadcrumb = subjectType === 'standard' && !resourceId;

  const { data: freshData, previousData } = useGraphQuery<
    GQLMastHeadQuery,
    GQLMastHeadQueryVariables
  >(mastheadQuery, {
    variables: {
      subjectId: subjectId!,
      resourceId: resourceId ?? '',
      skipResource: !resourceId,
    },
    skip: !subjectId,
  });

  const data = freshData ?? previousData;

  const path = useMemo(() => {
    if (!data?.subject?.allTopics?.length) {
      return [];
    }
    const keyed = keyBy(data.subject.allTopics, t => t.id);
    const transformed = topicList.map(t => keyed[t]);
    return transformed;
  }, [data?.subject?.allTopics, topicList]);

  const breadcrumbBlockItems = (data?.subject?.id
    ? toBreadcrumbItems(t('breadcrumb.toFrontpage'), [
        data.subject,
        ...path,
        ...(data?.resource ? [data.resource] : []),
      ])
    : []
  ).filter(uri => !!uri.name && !!uri.to);

  const renderSearchComponent = (hideOnNarrowScreen: boolean) =>
    !location.pathname.includes('search') &&
    location.pathname !== '/' &&
    (location.pathname.includes('utdanning') || data?.subject) && (
      <MastheadSearch
        subject={data?.subject}
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
          <MastheadDrawer subject={data?.subject} />
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
            locales={supportedLanguages}
            onSelect={i18n.changeLanguage}
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
