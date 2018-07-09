/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { OneColumn, ErrorMessage } from 'ndla-ui';
import { injectT } from 'ndla-i18n';
import Route from 'react-router-dom/Route';
import { HelmetWithTracker } from 'ndla-tracker';

const Status = ({ code, children }) => (
  <Route
    render={({ staticContext }) => {
      const context = staticContext;
      if (staticContext) {
        context.status = code;
      }
      return children;
    }}
  />
);

Status.propTypes = {
  code: PropTypes.number.isRequired,
};

const NotFound = ({ t }) => (
  <Status code={404}>
    <HelmetWithTracker title={t('htmlTitles.notFound')} />
    <OneColumn cssModifier="clear">
      <ErrorMessage
        illustration={{
          url: '/static/not-exist.gif',
          altText: t('errorMessage.title'),
        }}
        messages={{
          title: t('errorMessage.title'),
          description: t('notFoundPage.errorDescription'),
          back: t('errorMessage.back'),
          goToFrontPage: t('errorMessage.goToFrontPage'),
        }}
      />
    </OneColumn>
  </Status>
);

NotFound.propTypes = {};

export default injectT(NotFound);
