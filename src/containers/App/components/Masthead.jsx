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
import { injectSubjects } from '../../SubjectPage/subjectHOCs';
import SubjectsMenu from './SubjectsMenu';
import SiteNavMenuItem from './SiteNavMenuItem';

const Masthead = ({ t, subjects }) => (
  <UIMasthead>
    <MastheadItem left>
      <Logo to="/" altText="Nasjonal digital læringsarena" />
    </MastheadItem>
    <MastheadItem right>
      <SiteNav>
        <SiteNavMenuItem
          className="c-site-navigation__item c-site-navigation__item--bold"
          toggle={
            <Link to="/subjects/" className="c-site-navigation__link">
              {t('siteNav.chooseSubject')}
            </Link>
          }
        >
          <SubjectsMenu subjects={subjects} />
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
  subjects: PropTypes.array.isRequired,
};

export default injectSubjects(Masthead);
