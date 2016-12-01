/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { Masthead as UIMasthead, MastheadItem, SiteNav, SiteNavItem, Logo } from 'ndla-ui';
import { toSearch } from '../../../routes';
import SubjectsMenu from './SubjectsMenu';
import SiteNavMenuItem from './SiteNavMenuItem';

const Masthead = ({ t }) => (
  <UIMasthead>
    <MastheadItem left>
      <Logo to="/" altText="Nasjonal digital læringsarena" />
    </MastheadItem>
    <MastheadItem right>
      <SiteNav>
        <SiteNavMenuItem
          className="site-nav_item site-nav_item--bold"
          toggle={
            <Link to="/subjects/" className="site-nav_link">
              {t('siteNav.chooseSubject')}
            </Link>
          }
        >
          <SubjectsMenu />
        </SiteNavMenuItem>
        <SiteNavItem to={toSearch()}>
          {t('siteNav.search')}
        </SiteNavItem>
        <SiteNavItem to="#">
          {t('siteNav.contact')}
        </SiteNavItem>
        <SiteNavItem to="#">
          {t('siteNav.help')}
        </SiteNavItem>
      </SiteNav>
    </MastheadItem>
  </UIMasthead>
);

Masthead.propTypes = {
  t: PropTypes.func.isRequired,
};

export default Masthead;
