/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { PageContainer } from '@ndla/ui';
import { injectT } from '@ndla/i18n';
import ZendeskButton from '@ndla/zendesk';

import config from '../../config';
import Footer from './components/Footer';
import { LocationShape } from '../../shapes';

export const Page = ({
  children,
  background,
  locale,
  t,
  ndlaFilm,
  location,
}) => (
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
    <Footer locale={locale} location={location}>
      {config.zendeskWidgetKey && (
        <ZendeskButton locale={locale} widgetKey={config.zendeskWidgetKey}>
          {t('askNDLA')}
        </ZendeskButton>
      )}
    </Footer>
  </PageContainer>
);

Page.propTypes = {
  locale: PropTypes.string.isRequired,
  background: PropTypes.bool,
  ndlaFilm: PropTypes.bool,
  location: LocationShape,
};

Page.defaultProps = {
  background: true,
};

export default injectT(Page);
