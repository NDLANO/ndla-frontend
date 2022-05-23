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
  getInitialMastheadMenu,
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
  getCategorizedSubjects,
  getProgrammes,
} from '../../util/programmesSubjectsHelper';
import { getProgrammeBySlug } from '../../data/programmes';
import { mapGradesData } from '../ProgrammePage/ProgrammePage';
import {
  GQLMastHeadQuery,
  GQLMastHeadQueryVariables,
  GQLResourceType,
  GQLTopicInfoFragment,
} from '../../graphqlTypes';
import config from '../../config';
import { setClosedAlert, useAlerts } from '../../components/AlertsContext';
import { SKIP_TO_CONTENT_ID } from '../../constants';

interface State {
  subject?: GQLMastHeadQuery['subject'];
  topicPath?: GQLTopicInfoFragment[];
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
    topicId,
    programme,
    subjectType,
  } = useUrnIds();
  const location = useLocation();
  const ndlaFilm = useIsNdlaFilm();
  const initialSelectedMenu = getInitialMastheadMenu(location.pathname);
  const hideBreadcrumb = subjectType === 'standard' && !resourceId;

  useEffect(() => {
    updateData();
  }, [location.pathname, location.search]); // eslint-disable-line react-hooks/exhaustive-deps

  const [fetchData, { data }] = useLazyQuery<
    GQLMastHeadQuery,
    GQLMastHeadQueryVariables
  >(mastHeadQuery, { ssr: true });

  useEffect(() => {
    // we set data in state to prevent it from disappearing in view when we refecth
    if (data) {
      const stateData = mapMastheadData({
        subjectId: subjectId ?? '',
        topicId: topicId ?? '',
        data,
      });
      setState(stateData);
    }
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateData = () => {
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

  let currentProgramme;
  if (programme) {
    const programmeData = getProgrammeBySlug(programme, locale);
    if (programmeData) {
      const grades = mapGradesData(programmeData.grades, locale);
      currentProgramme = {
        name: programmeData.name[locale],
        url: programmeData.url[locale],
        grades,
      };
    }
  }

  const { subject, topicPath, topicResourcesByType, resource } = state;
  const path = topicPath ?? [];

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
          <MastheadMenu
            subject={subject}
            searchFieldComponent={renderSearchComponent(false)}
            onDataFetch={onDataFetch}
            topicResourcesByType={topicResourcesByType || []}
            locale={locale}
            programmes={getProgrammes(locale)}
            currentProgramme={currentProgramme}
            subjectCategories={getCategorizedSubjects(locale)}
            initialSelectMenu={initialSelectedMenu}
          />
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
