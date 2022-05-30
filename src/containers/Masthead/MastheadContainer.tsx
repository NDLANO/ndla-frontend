/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState, useEffect } from 'react';
import {
  Masthead,
  MastheadItem,
  LanguageSelector,
  Logo,
  DisplayOnPageYOffset,
  BreadcrumbBlock,
} from '@ndla/ui';
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
} from '../../graphqlTypes';
import config from '../../config';
import { setClosedAlert, useAlerts } from '../../components/AlertsContext';
import { SKIP_TO_CONTENT_ID } from '../../constants';
import { getTopicPath } from '../../util/getTopicPath';
import MastheadMenuModal from './components/MastheadMenuModal';

interface State {
  subject?: GQLMastHeadQuery['subject'];
  topicResourcesByType?: GQLResourceType[];
  resource?: GQLMastHeadQuery['resource'];
}

const MastheadContainer = () => {
  const [state, setState] = useState<State>({});
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const {
    subjectId,
    resourceId,
    topicId: topicIdParam,
    subjectType,
  } = useUrnIds();
  const [topicId, setTopicId] = useState<string>(topicIdParam ?? '');
  const location = useLocation();
  const ndlaFilm = useIsNdlaFilm();
  const hideBreadcrumb = subjectType === 'standard' && !resourceId;

  const [fetchData] = useLazyQuery<GQLMastHeadQuery, GQLMastHeadQueryVariables>(
    mastHeadQuery,
    {
      onCompleted: data => setState(mapMastheadData({ subjectId, data })),
    },
  );

  useEffect(() => {
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

  const { subject, topicResourcesByType, resource } = state;
  const path =
    subject?.topics && subjectId
      ? getTopicPath(subjectId, topicId, subject.topics)
      : [];

  const breadcrumbBlockItems = (subject?.id
    ? toBreadcrumbItems(
        t('breadcrumb.toFrontpage'),
        [subject, ...path, ...(resource ? [resource] : [])],
        locale,
      )
    : []
  ).filter(uri => !!uri.name && !!uri.to);

  const renderSearchComponent = (hideOnNarrowScreen: boolean) =>
    !location.pathname.includes('search') &&
    (location.pathname.includes('utdanning') || subject) && (
      <MastheadSearch
        subject={subject}
        hideOnNarrowScreen={hideOnNarrowScreen}
      />
    );

  const alerts = useAlerts().map(alert => ({
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
        onCloseAlert={id => setClosedAlert(id)}
        messages={alerts}>
        <MastheadItem left>
          <MastheadMenuModal>
            {(onClose: () => void) => (
              <MastheadMenu
                locale={locale}
                subject={subject}
                topicResourcesByType={topicResourcesByType ?? []}
                onTopicChange={newId => setTopicId(newId)}
                close={onClose}
              />
            )}
          </MastheadMenuModal>
          {!hideBreadcrumb && (
            <DisplayOnPageYOffset yOffsetMin={150}>
              <BreadcrumbBlock
                items={
                  breadcrumbBlockItems.length > 1
                    ? breadcrumbBlockItems
                        .slice(1)
                        .map(uri => ({ name: uri.name!, to: uri.to! }))
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
            currentLanguage={i18n.language}
          />
          {config.feideEnabled && (
            <FeideLoginButton>
              <Feide title={t('user.buttonLogIn')} />
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
