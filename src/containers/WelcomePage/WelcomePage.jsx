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
import { OneColumn, ErrorMessage } from 'ndla-ui';
import Link from 'react-router-dom/Link';
import { injectT } from 'ndla-i18n';

import { toSearch } from '../../routeHelpers';
import { SubjectShape } from '../../shapes';
import { injectSubjects } from '../SubjectPage/subjectHOCs';
import { SubjectLinkList } from '../../components';

export const WelcomePage = ({ t, subjects, searchEnabled, hasFailed }) => (
  <OneColumn cssModifier="clear">
    {!hasFailed ? (
      <section>
        <h1>{t('welcomePage.subjects')}</h1>
        <SubjectLinkList subjects={subjects} />{' '}
      </section>
    ) : (
      <ErrorMessage
        messages={{
          title: t('errorMessage.title'),
          description: t('welcomePage.errorDescription'),
        }}
      />
    )}
    {searchEnabled ? (
      <section>
        <Link to={toSearch()}>{t('welcomePage.search')}</Link>
      </section>
    ) : null}
  </OneColumn>
);

WelcomePage.propTypes = {
  hasFailed: PropTypes.bool.isRequired,
  subjects: PropTypes.arrayOf(SubjectShape),
  searchEnabled: PropTypes.bool.isRequired,
};

export default compose(injectT, injectSubjects)(WelcomePage);
