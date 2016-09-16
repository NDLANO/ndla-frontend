/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { injectT } from '../i18n';
import SelectLocale from '../containers/Locale/SelectLocale';

export const Footer = ({ t }) =>
  <footer className="footer">
    <form className="footer_language-form">
      <label className="footer_language-label footer--bold" htmlFor="language-select">{t('footer.selectLanguage')}</label>
      <SelectLocale id="language-select" className="footer_language-select" />
    </form>
    <div className="footer_ruler" />
    <p className="footer_text">
      <span className="footer_editor">{t('footer.footerEditiorInChief')}<strong>Øivind Høines</strong></span>
      <span className="footer_editor">{t('footer.footerManagingEditor')}<strong>Pål Frønsdal</strong></span>
    </p>
    <p className="footer_text">
      {t('footer.footerInfo')}
    </p>
  </footer>;

export default injectT(Footer);
