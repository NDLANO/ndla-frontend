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

export const Page = props => {
  const { children, background, locale, t, ndlaFilm } = props;
  return (
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
      <Footer t={t} locale={locale} inverted={ndlaFilm}>
        {config.zendeskWidgetKey && (
          <ZendeskButton
            style={{ backgroundColor: '#184673' }}
            locale={locale}
            widgetKey={config.zendeskWidgetKey}>
            {t('askNDLA')}
          </ZendeskButton>
        )}
      </Footer>
    </PageContainer>
  );
};

Page.propTypes = {
  locale: PropTypes.string.isRequired,
  background: PropTypes.bool,
  ndlaFilm: PropTypes.bool,
};

Page.defaultProps = {
  background: true,
};

export default injectT(Page);
