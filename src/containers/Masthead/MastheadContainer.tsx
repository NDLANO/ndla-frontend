/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext } from 'react';
import { Masthead, LanguageSelector, Logo } from '@ndla/ui';
import styled from '@emotion/styled';
import { breakpoints, mq, spacing } from '@ndla/core';
import { gql } from '@apollo/client';

import { Feide } from '@ndla/icons/common';
import { useTranslation } from 'react-i18next';
import { useIsNdlaFilm, useUrnIds } from '../../routeHelpers';

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

const FeideLoginLabel = styled.span`
  ${mq.range({ until: breakpoints.mobileWide })} {
    display: none;
  }
`;

const LanguageSelectWrapper = styled.div`
  margin-left: ${spacing.xxsmall};
  ${mq.range({ until: breakpoints.desktop })} {
    display: none;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: ${spacing.xsmall};
  align-items: center;
  justify-content: flex-end;
  flex: 1;
`;

const DrawerWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  flex: 1;
`;

const LogoWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const mastheadQuery = gql`
  query mastHead($subjectId: String!) {
    subject(id: $subjectId) {
      ...MastheadDrawer_Subject
    }
  }
  ${MastheadDrawer.fragments.subject}
`;

const MastheadContainer = () => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const { subjectId } = useUrnIds();
  const { user } = useContext(AuthContext);
  const { openAlerts, closeAlert } = useAlerts();
  const ndlaFilm = useIsNdlaFilm();
  const { data: freshData, previousData } = useGraphQuery<
    GQLMastHeadQuery,
    GQLMastHeadQueryVariables
  >(mastheadQuery, {
    variables: {
      subjectId: subjectId!,
    },
    skip: !subjectId,
  });

  const data = subjectId ? freshData ?? previousData : undefined;

  const alerts = openAlerts?.map((alert) => ({
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
        onCloseAlert={(id) => closeAlert(id)}
        messages={alerts}
      >
        <DrawerWrapper>
          <MastheadDrawer subject={data?.subject} />
        </DrawerWrapper>
        <LogoWrapper>
          <Logo
            to="/"
            locale={locale}
            label="NDLA"
            cssModifier={ndlaFilm ? 'white' : ''}
          />
        </LogoWrapper>
        <ButtonWrapper>
          <MastheadSearch subject={data?.subject} />
          <LanguageSelectWrapper>
            <LanguageSelector
              inverted={ndlaFilm}
              locales={supportedLanguages}
              onSelect={i18n.changeLanguage}
            />
          </LanguageSelectWrapper>
          {config.feideEnabled && (
            <FeideLoginButton>
              <FeideLoginLabel data-hj-suppress>
                {user ? t('myNdla.myNDLA') : t('login')}
              </FeideLoginLabel>
              <Feide />
            </FeideLoginButton>
          )}
        </ButtonWrapper>
      </Masthead>
    </ErrorBoundary>
  );
};

export default MastheadContainer;
