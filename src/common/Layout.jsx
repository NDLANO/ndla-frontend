/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import polyglot from '../i18n';
import SelectLocale from '../locale/SelectLocale';

export const Wrapper = ({ children }) => <div className="wrapper">{children}</div>;

export const Footer = () =>
  <footer className="footer">
    <form className="footer_language-form">
      <label className="footer_language-label footer--bold" htmlFor="language-select">{polyglot.t('footer.selectLanguage')}</label>
      <SelectLocale id="language-select" className="footer_language-select" />
    </form>
  </footer>;
