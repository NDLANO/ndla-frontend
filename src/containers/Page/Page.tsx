/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from 'react';
import { Helmet } from 'react-helmet';
import { RouteProps } from 'react-router';
// @ts-ignore
import { PageContainer } from '@ndla/ui';
// @ts-ignore
import { useTranslation } from 'react-i18next';
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
      <Footer inverted={ndlaFilm} location={location} />
      {config.feideEnabled && <FeideFooter location={location} />}
    </PageContainer>
  );
};

export default Page;
