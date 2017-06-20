/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { OneColumn } from 'ndla-ui';
import Link from 'react-router-dom/Link';

import { injectT } from '../../i18n';
import { toSearch } from '../../routeHelpers';
import { SubjectShape } from '../../shapes';
import { injectSubjects } from '../SubjectPage/subjectHOCs';
import { SubjectLinkList } from '../../components';

export const WelcomePage = ({ t, subjects, searchEnabled }) =>
  <div className="c-resources u-padding-top-large">
    <OneColumn>
      <article>
        <section>
          <h1>{t('welcomePage.subjects')}</h1>
          <SubjectLinkList subjects={subjects} />
        </section>
        {searchEnabled
          ? <section>
              <Link to={toSearch()}>{t('welcomePage.search')}</Link>
            </section>
          : null}
      </article>
    </OneColumn>
  </div>;

WelcomePage.propTypes = {
  subjects: PropTypes.arrayOf(SubjectShape),
  searchEnabled: PropTypes.bool.isRequired,
};

export default compose(injectT, injectSubjects)(WelcomePage);
