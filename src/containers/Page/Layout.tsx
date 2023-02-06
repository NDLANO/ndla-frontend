/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect } from 'react';
import { Content, PageContainer, useMastheadHeight } from '@ndla/ui';
import ZendeskButton from '@ndla/zendesk';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { css, Global } from '@emotion/react';
import { matchPath, Outlet, useLocation } from 'react-router-dom';
import Masthead from '../Masthead';
import config from '../../config';
import FeideFooter from './components/FeideFooter';
import Footer from './components/Footer';
import { useIsNdlaFilm, useUrnIds } from '../../routeHelpers';
import { usePrevious } from '../../util/utilityHooks';
import TitleAnnouncer from './components/TitleAnnouncer';
import {
  defaultValue,
  useVersionHash,
} from '../../components/VersionHashContext';

const ZendeskWrapper = styled.div`
  z-index: 10;
`;

const Layout = () => {
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();
  const { height } = useMastheadHeight();
  const prevPathname = usePrevious(pathname);
  const params = useUrnIds();
  const zendeskLanguage =
    i18n.language === 'nb' || i18n.language === 'nn' ? 'no' : i18n.language;
  const ndlaFilm = useIsNdlaFilm();
  const backgroundWide = !!matchPath(
    '/learningpaths/:learningpathId',
    pathname,
  );

  useEffect(() => {
    if (!prevPathname || pathname === prevPathname) {
      return;
    }
    const inSubjectOrTopic =
      params.subjectType !== 'multiDisciplinary' &&
      params.topicId &&
      !params.resourceId;
    const inMulti =
      params.subjectType === 'multiDisciplinary' &&
      params.topicId &&
      params.topicList.length !== 3;
    const searchUpdate = pathname === '/search' && prevPathname === '/search';
    if (!searchUpdate && !inSubjectOrTopic && !inMulti) {
      window.scrollTo(0, 0);
    }
  }, [params, pathname, prevPathname]);

  const hash = useVersionHash();
  const isDefaultVersion = hash === defaultValue;
  const metaChildren = isDefaultVersion ? null : (
    <meta name="robots" content="noindex" />
  );

  return (
    <PageContainer backgroundWide={backgroundWide} ndlaFilm={ndlaFilm}>
      <TitleAnnouncer />
      <Global
        styles={css`
          html {
            scroll-padding-top: ${height ? `${height}px` : undefined};
          }
        `}
      />
      <Helmet
        htmlAttributes={{ lang: i18n.language }}
        meta={[{ name: 'description', content: t('meta.description') }]}>
        {metaChildren}
      </Helmet>
      <Masthead />
      <Content>
        <Outlet />
      </Content>
      <Footer ndlaFilm={ndlaFilm} />
      {config.feideEnabled && <FeideFooter />}
      {config.zendeskWidgetKey && (
        <ZendeskWrapper>
          <ZendeskButton
            id="zendesk"
            locale={zendeskLanguage}
            widgetKey={config.zendeskWidgetKey}>
            {t('askNDLA')}
          </ZendeskButton>
        </ZendeskWrapper>
      )}
    </PageContainer>
  );
};
export default Layout;
