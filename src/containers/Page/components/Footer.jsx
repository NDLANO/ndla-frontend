/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Footer } from '@ndla/ui';
import SelectLocale from '../../Locale/SelectLocale';

const FooterWrapper = ({ t, children, locale, inverted }) => (
  <Footer lang={locale} inverted={inverted}>
    <form className="footer_form">
      <label className="footer_label footer--bold" htmlFor="language-select">
        {t('footer.selectLanguage')}
      </label>
      <SelectLocale
        id="language-select"
        locale={locale}
        className="footer_language-select"
      />
    </form>
    <Footer.Ruler />
    <Footer.Text>
      <Footer.Editor
        title={t('footer.footerEditiorInChief')}
        name="Sigurd Trageton"
      />
    </Footer.Text>
    <Footer.Text>{t('footer.footerInfo')}</Footer.Text>
    {children}
  </Footer>
);

FooterWrapper.propTypes = {
  inverted: PropTypes.bool,
  locale: PropTypes.string.isRequired,
  children: PropTypes.node,
  t: PropTypes.func.isRequired,
};

export default FooterWrapper;
