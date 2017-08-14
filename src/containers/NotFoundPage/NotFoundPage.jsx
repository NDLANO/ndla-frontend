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

const Status = ({ code, children }) =>
  <Route
    render={({ staticContext }) => {
      const context = staticContext;
      if (staticContext) {
        context.status = code;
      }
      return children;
    }}
  />;

Status.propTypes = {
  code: PropTypes.number.isRequired,
};

const NotFound = ({ t }) =>
  <Status code={404}>
    <OneColumn cssModifier="clear">
      <ErrorMessage
        messages={{
          title: t('notFoundPage.title'),
          description: t('notFoundPage.description'),
          back: t('notFoundPage.back'),
          goToFrontPage: t('notFoundPage.goToFrontPage'),
        }}
      />
    </OneColumn>
  </Status>;

NotFound.propTypes = {};

export default injectT(NotFound);
