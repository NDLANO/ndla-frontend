/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { OneColumn, ErrorMessage } from 'ndla-ui';
import { injectT } from 'ndla-i18n';

export const DefaultErrorMessage = injectT(({ t }) => (
  <OneColumn cssModifier="clear">
    <ErrorMessage
      illustration={{
        url: '/static/oops.gif',
        altText: t('errorMessage.title'),
      }}
      messages={{
        title: t('errorMessage.title'),
        description: t('errorMessage.description'),
        linksTitle: t('errorMessage.linksTitle'),
        back: t('errorMessage.back'),
        goToFrontPage: t('errorMessage.goToFrontPage'),
      }}
    />
  </OneColumn>
));

// DefaultErrorMessage.propTypes = {};
// export default injectT(DefaultErrorMessage);
