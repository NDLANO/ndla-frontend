/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router';
import polyglot from '../i18n';

export const SiteNavItem = ({ to, children, cssModifier }) =>
  <li className={classNames('site-nav_item', `site-nav_item--${cssModifier}`)}>
    <Link to={to} className="site-nav_link">
      {children}
    </Link>
  </li>;

SiteNavItem.propTypes = {
  cssModifier: PropTypes.string,
  to: PropTypes.string.isRequired,
};

export const SiteNav = ({ cssModifier }) => {
  const classes = classNames('site-nav', `site-nav--${cssModifier}`);

  return (
    <div className={classes}>
      <ul className="site-nav_list">
        <SiteNavItem to="#" cssModifier="bold">
          {polyglot.t('siteNav.chooseSubject')}
        </SiteNavItem>
        <SiteNavItem to="/search">
          {polyglot.t('siteNav.search')}
        </SiteNavItem>
        <SiteNavItem to="#">
          {polyglot.t('siteNav.contact')}
        </SiteNavItem>
        <SiteNavItem to="#">
          {polyglot.t('siteNav.help')}
        </SiteNavItem>
      </ul>
    </div>
  );
};

SiteNav.propTypes = {
  cssModifier: PropTypes.string,
};

export default SiteNav;
