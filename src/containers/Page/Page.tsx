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
import { injectT, tType } from '@ndla/i18n';
// @ts-ignore
import ZendeskButton from '@ndla/zendesk';
import config from '../../config';
import Footer from './components/Footer';

interface Props {
  locale: string;
  background?: boolean;
  ndlaFilm?: boolean;
  children?: ReactNode;
  location: RouteProps['location'];
}

export const Page = ({
  children,
  background = true,
  locale,
  t,
  ndlaFilm,
  location,
}: Props & tType) => (
  <PageContainer backgroundWide={background} ndlaFilm={ndlaFilm}>
    <Helmet
      htmlAttributes={{ lang: locale }}
      title="NDLA"
      meta={[{ name: 'description', content: t('meta.description') }]}
    />
    <Helmet>
      <meta property="fb:app_id" content="115263542481787" />
    </Helmet>
    {children}
    <Footer inverted={ndlaFilm} locale={locale} location={location}>
      {config.zendeskWidgetKey && (
        <ZendeskButton locale={locale} widgetKey={config.zendeskWidgetKey}>
          {t('askNDLA')}
        </ZendeskButton>
      )}
    </Footer>
  </PageContainer>
);

export default injectT(Page);
