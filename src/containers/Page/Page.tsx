/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { ReactNode } from 'react';
import { Helmet } from 'react-helmet';
import { RouteProps } from 'react-router';
// @ts-ignore
import { PageContainer } from '@ndla/ui';
import { useTranslation } from 'react-i18next';
import ZendeskButton from '@ndla/zendesk';
import config from '../../config';
import Footer from './components/Footer';
import FeideFooter from './components/FeideFooter';

interface Props {
  background?: boolean;
  ndlaFilm?: boolean;
  children?: ReactNode;
  location: RouteProps['location'];
}

export const Page = ({
  children,
  background = true,
  ndlaFilm,
  location,
}: Props) => {
  const { t, i18n } = useTranslation();
  const zendeskLanguage =
    i18n.language === 'nb' || i18n.language === 'nn' ? 'no' : i18n.language;
  return (
    <PageContainer backgroundWide={background} ndlaFilm={ndlaFilm}>
      <Helmet
        htmlAttributes={{ lang: i18n.language }}
        title="NDLA"
        meta={[{ name: 'description', content: t('meta.description') }]}
      />
      <Helmet>
        <meta property="fb:app_id" content="115263542481787" />
      </Helmet>
      {children}
      <Footer inverted={ndlaFilm} />
      {config.feideEnabled && <FeideFooter location={location} />}
      {config.zendeskWidgetKey && (
        <ZendeskButton
          locale={zendeskLanguage}
          widgetKey={config.zendeskWidgetKey}>
          {t('askNDLA')}
        </ZendeskButton>
      )}
    </PageContainer>
  );
};

export default Page;
