/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PropTypes } from 'react';
import { Masthead as UIMasthead, MastheadItem, SiteNav, SiteNavItem, Logo } from 'ndla-ui';
import { toSearch } from '../../../routes';

const Masthead = ({ t }) => (
  <UIMasthead>
    <MastheadItem left>
      <Logo to="/" altText="Nasjonal digital læringsarena" />
    </MastheadItem>
    <MastheadItem right>
      <SiteNav>
        <SiteNavItem to="#" cssModifier="bold">
          {t('siteNav.chooseSubject')}
        </SiteNavItem>
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
