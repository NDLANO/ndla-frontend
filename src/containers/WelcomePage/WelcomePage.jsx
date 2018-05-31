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
import { OneColumn, ErrorMessage, BetaNavigation, Hero } from 'ndla-ui';
import { injectT } from 'ndla-i18n';
import { HelmetWithTracker } from 'ndla-tracker';
import { toSubject } from '../../routeHelpers';
import { SubjectShape } from '../../shapes';
import { injectSubjects } from '../SubjectPage/subjectHOCs';
import BetaFrontpage from './BetaFrontpage';
import Oops from '../../assets/oops.gif';

export const WelcomePage = ({ t, subjects, hasFailed }) => (
  <React.Fragment>
    <Hero contentType="beta">
      <HelmetWithTracker title={t('htmlTitles.welcomePage')} />
      <OneColumn>
        {!hasFailed ? (
          <div className="c-hero__content" data-cy="subject-list">
            <BetaNavigation
              links={subjects.map(it => ({
                url: toSubject(it.id),
                text: it.name,
              }))}
            />
          </div>
        ) : (
          <ErrorMessage
            illustration={{
              url: Oops,
              altText: t('errorMessage.title'),
            }}
            messages={{
              title: t('errorMessage.title'),
              description: t('welcomePage.errorDescription'),
            }}
          />
        )}
      </OneColumn>
    </Hero>
    <BetaFrontpage />
  </React.Fragment>
);

WelcomePage.propTypes = {
  hasFailed: PropTypes.bool.isRequired,
  subjects: PropTypes.arrayOf(SubjectShape),
};

export default compose(injectT, injectSubjects)(WelcomePage);
