/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect } from 'react';
import { Content, PageContainer } from '@ndla/ui';
import ZendeskButton from '@ndla/zendesk';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { matchPath, Outlet, useLocation } from 'react-router-dom';
import Masthead from '../Masthead';
import config from '../../config';
import FeideFooter from './components/FeideFooter';
import Footer from './components/Footer';
import { useIsNdlaFilm, useUrnIds } from '../../routeHelpers';
import { usePrevious } from '../../util/utilityHooks';

const Layout = () => {
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();
  const prevPathname = usePrevious(pathname);
  const params = useUrnIds();
  const zendeskLanguage =
    i18n.language === 'nb' || i18n.language === 'nn' ? 'no' : i18n.language;
  const ndlaFilm = useIsNdlaFilm();
  const showMasthead = true;//pathname !== '/';
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

  return (
    <PageContainer backgroundWide={backgroundWide} ndlaFilm={ndlaFilm}>
      <Helmet
        htmlAttributes={{ lang: i18n.language }}
        title="NDLA"
        meta={[{ name: 'description', content: t('meta.description') }]}
      />
      <Helmet>
        <meta property="fb:app_id" content="115263542481787" />
      </Helmet>
      {showMasthead && <Masthead />}
      <Content>
        <Outlet />
      </Content>
      <Footer ndlaFilm={ndlaFilm} />
      {config.feideEnabled && <FeideFooter />}
      {config.zendeskWidgetKey && (
        <ZendeskButton
          id="zendesk"
          locale={zendeskLanguage}
          widgetKey={config.zendeskWidgetKey}>
          {t('askNDLA')}
        </ZendeskButton>
      )}
    </PageContainer>
  );
};
export default Layout;
