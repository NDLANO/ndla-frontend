/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PropTypes } from 'react';
import classNames from 'classnames';
import SiteNav from './SiteNav';
import Logo from './Logo';
import polyglot from '../i18n';
import SelectLocale from '../locale/SelectLocale';

export const Wrapper = ({ children }) => <div className="wrapper">{children}</div>;

export const OneColumn = ({ children, className, modifier }) => {
  const modifierClass = modifier ? `one-column--${modifier}` : '';
  const classes = classNames('one-column', modifierClass, className);
  return <div className={classes}>{children}</div>;
};

OneColumn.propTypes = {
  modifier: PropTypes.string,
};

export const Footer = () =>
  <footer className="footer">
    <form className="footer_language-form">
      <label className="footer_language-label footer--bold" htmlFor="language-select">{polyglot.t('footer.selectLanguage')}</label>
      <SelectLocale id="language-select" className="footer_language-select" />
    </form>
    <div className="footer_ruler" />
    <p className="footer_text">
      <span className="footer_editor">{polyglot.t('footer.footerEditiorInChief')}<strong>Øivind Høines</strong></span>
      <span className="footer_editor">{polyglot.t('footer.footerManagingEditor')} <strong>Pål Frønsdal</strong></span>
    </p>
    <p className="footer_text">
      {polyglot.t('footer.footerInfo')}
    </p>
  </footer>;

export const Masthead = () =>
  <div className="masthead">
    <div className="masthead_left">
      <Logo />
    </div>
    <div className="masthead_right">
      <SiteNav />
    </div>
  </div>;
