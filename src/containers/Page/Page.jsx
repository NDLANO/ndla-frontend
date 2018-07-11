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
import { PageContainer } from 'ndla-ui';
import { injectT } from 'ndla-i18n';

import Footer from './components/Footer';

const Page = props => {
  const { children, background, locale, t } = props;
  return (
    <PageContainer backgroundWide={background}>
      <Helmet
        htmlAttributes={{ lang: locale }}
        title="NDLA"
        meta={[{ name: 'description', content: t('meta.description') }]}
      />
      {children}
      <Footer t={t} locale={locale} />
    </PageContainer>
  );
};

Page.propTypes = {
  locale: PropTypes.string.isRequired,
  background: PropTypes.bool,
};

Page.defaultProps = {
  background: true,
};

export default injectT(Page);
