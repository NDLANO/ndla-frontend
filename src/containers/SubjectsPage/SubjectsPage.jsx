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
import { injectT } from 'ndla-i18n';
import { SubjectLinkList } from '../../components';
import { injectSubjects } from '../SubjectPage/subjectHOCs';
import { SubjectShape } from '../../shapes';

const SubjectsPage = ({ t, subjects }) =>
  <div className="c-resources u-padding-top-large">
    <OneColumn>
      <article>
        <section>
          <h2>
            {t('subjectsPage.chooseSubject')}
          </h2>
          <SubjectLinkList subjects={subjects} />
        </section>
      </article>
    </OneColumn>
  </div>;

SubjectsPage.propTypes = {
  subjects: PropTypes.arrayOf(SubjectShape).isRequired,
};

export default compose(injectT, injectSubjects)(SubjectsPage);
