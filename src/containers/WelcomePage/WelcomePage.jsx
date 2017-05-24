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
import { injectT } from '../../i18n';
import { SubjectShape } from '../../shapes';
import { injectSubjects } from '../SubjectPage/subjectHOCs';
import { SubjectLinkList } from '../../components';

export const WelcomePage = ({ t, subjects }) =>
  <div className="c-resources u-padding-top-large">
    <OneColumn cssModifier="narrow">
      <article>
        <section>
          <h1>{t('welcomePage.subjects')}</h1>
          <SubjectLinkList subjects={subjects} />
        </section>
      </article>
    </OneColumn>
  </div>
;

WelcomePage.propTypes = {
  subjects: PropTypes.arrayOf(SubjectShape),
};

export default compose(
  injectT,
  injectSubjects,
)(WelcomePage);
