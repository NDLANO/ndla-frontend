/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PropTypes } from 'react';
import { compose } from 'redux';
import { OneColumn } from 'ndla-ui';
import { injectT } from '../../i18n';
import { SubjectShape } from '../../shapes';
import { injectSubjects } from '../SubjectPage/subjectHOCs';
import { SubjectLinkList } from '../../components';

export const WelcomePage = ({ t, subjects }) =>
  <OneColumn cssModifier="narrow">
    <h2>{t('welcomePage.chooseSubject')}</h2>
    <SubjectLinkList subjects={subjects} />
  </OneColumn>
;

WelcomePage.propTypes = {
  subjects: PropTypes.arrayOf(SubjectShape),
};

export default compose(
  injectT,
  injectSubjects,
)(WelcomePage);
