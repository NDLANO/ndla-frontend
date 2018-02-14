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

import { toSubject } from '../../routeHelpers';
import { SubjectShape } from '../../shapes';
import { injectSubjects } from '../SubjectPage/subjectHOCs';
import BetaFrontpage from './BetaFrontpage';

export const WelcomePage = ({ t, subjects, searchEnabled, hasFailed }) => (
  <React.Fragment>
    <Hero contentType="beta">
      <OneColumn>
        {!hasFailed ? (
          <div className="c-hero__content">
            <BetaNavigation
              links={subjects.map(it => ({
                url: toSubject(it.id),
                text: it.name,
              }))}
            />
          </div>
        ) : (
          <ErrorMessage
            messages={{
              title: t('errorMessage.title'),
              description: t('welcomePage.errorDescription'),
            }}
          />
        )}
      </OneColumn>
    </Hero>
    <BetaFrontpage searchEnabled={searchEnabled} />
  </React.Fragment>
);

WelcomePage.propTypes = {
  hasFailed: PropTypes.bool.isRequired,
  subjects: PropTypes.arrayOf(SubjectShape),
  searchEnabled: PropTypes.bool.isRequired,
};

export default compose(injectT, injectSubjects)(WelcomePage);
