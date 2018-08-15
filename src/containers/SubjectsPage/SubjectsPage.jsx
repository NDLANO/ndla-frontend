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
import { HelmetWithTracker } from 'ndla-tracker';
import { OneColumn, ErrorMessage } from 'ndla-ui';
import { injectT } from 'ndla-i18n';
import { SubjectLinkList } from '../../components';
import { injectSubjects } from '../SubjectPage/subjectHOCs';
import { SubjectShape } from '../../shapes';

const SubjectsPage = ({ t, subjects, hasFailed }) => (
  <div className="c-resources u-padding-top-large">
    <HelmetWithTracker title={t('htmlTitles.subjectsPage')} />
    <OneColumn>
      {!hasFailed ? (
        <section>
          <h2>{t('subjectsPage.chooseSubject')}</h2>
          <SubjectLinkList subjects={subjects} />{' '}
        </section>
      ) : (
        <ErrorMessage
          illustration={{
            url: '/static/oops.gif',
            altText: t('errorMessage.title'),
          }}
          messages={{
            title: t('errorMessage.title'),
            description: t('subjectsPage.errorDescription'),
            back: t('errorMessage.back'),
            goToFrontPage: t('errorMessage.goToFrontPage'),
          }}
        />
      )}
    </OneColumn>
  </div>
);

SubjectsPage.propTypes = {
  subjects: PropTypes.arrayOf(SubjectShape).isRequired,
  hasFailed: PropTypes.bool.isRequired,
};

export default compose(
  injectT,
  injectSubjects,
)(SubjectsPage);
