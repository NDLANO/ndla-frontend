/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState, useEffect, ReactNode } from 'react';
import {
  Masthead,
  MastheadItem,
  LanguageSelector,
  Logo,
  DisplayOnPageYOffset,
  BreadcrumbBlock,
} from '@ndla/ui';
import { RouteComponentProps } from 'react-router';
import { useLazyQuery, useQuery } from '@apollo/client';

import { Feide } from '@ndla/icons/common';
import { useTranslation } from 'react-i18next';
import { getUrnIdsFromProps, toBreadcrumbItems } from '../../routeHelpers';

import FeideLoginButton from '../../components/FeideLoginButton';
import MastheadSearch from './components/MastheadSearch';
import MastheadMenu from './components/MastheadMenu';
import { alertsQuery, mastHeadQuery } from '../../queries';
import { getLocaleUrls } from '../../util/localeHelpers';
import ErrorBoundary from '../ErrorPage/ErrorBoundary';
import { mapMastheadData } from './mastheadHelpers';
import {
  getCategorizedSubjects,
  getProgrammes,
} from '../../util/programmesSubjectsHelper';
import { getProgrammeBySlug } from '../../data/programmes';
import { mapGradesData } from '../ProgrammePage/ProgrammePage';
import { LocaleType } from '../../interfaces';
import {
  GQLAlertsQuery,
  GQLMastHeadQuery,
  GQLMastHeadQueryVariables,
  GQLResourceType,
  GQLTopicInfoFragment,
} from '../../graphqlTypes';
import config from '../../config';

interface Props extends RouteComponentProps {
  locale: LocaleType;
  infoContent?: ReactNode;
  ndlaFilm?: boolean;
  skipToMainContentId?: string;
  hideBreadcrumb?: boolean;
  initialSelectMenu?: string;
}

interface State {
  subject?: GQLMastHeadQuery['subject'];
  topicPath?: GQLTopicInfoFragment[];
  topicResourcesByType?: GQLResourceType[];
  resource?: GQLMastHeadQuery['resource'];
}

const MastheadContainer = ({
  infoContent,
  locale,
  location,
  ndlaFilm,
  match,
  skipToMainContentId,
  hideBreadcrumb,
  initialSelectMenu,
}: Props) => {
  const [subjectId, setSubjectId] = useState('');
  const [topicId, setTopicId] = useState('');
  const [state, setState] = useState<State>({});
  const { t, i18n } = useTranslation();

  const { data: alertData } = useQuery<GQLAlertsQuery>(alertsQuery);

  useEffect(() => {
    updateData();
  }, [location.pathname, location.search]); // eslint-disable-line react-hooks/exhaustive-deps

  const [fetchData, { data }] = useLazyQuery<
    GQLMastHeadQuery,
    GQLMastHeadQueryVariables
  >(mastHeadQuery);

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

  const { programme } = getUrnIdsFromProps({ match });
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
        ndlaFilm={ndlaFilm}
        hideOnNarrowScreen={hideOnNarrowScreen}
      />
    );

  const alerts = alertData?.alerts?.map(alert => alert.body || alert.title);

  return (
    <ErrorBoundary>
      <Masthead
        fixed
        ndlaFilm={ndlaFilm}
        skipToMainContentId={skipToMainContentId}
        infoContent={infoContent}
        messages={alerts}>
        <MastheadItem left>
          <MastheadMenu
            subject={subject}
            ndlaFilm={ndlaFilm}
            searchFieldComponent={renderSearchComponent(false)}
            onDataFetch={onDataFetch}
            topicResourcesByType={topicResourcesByType || []}
            locale={locale}
            programmes={getProgrammes(locale)}
            currentProgramme={currentProgramme}
            subjectCategories={getCategorizedSubjects(locale)}
            initialSelectMenu={initialSelectMenu}
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
            <FeideLoginButton location={location}>
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
