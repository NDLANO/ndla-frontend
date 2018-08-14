/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { OneColumn, ErrorMessage } from 'ndla-ui';

export const TopicPageErrorMessage = ({ t }) => (
  <OneColumn>
    <div className="c-article">
      <ErrorMessage
        illustration={{
          url: '/static/oops.gif',
          altText: t('errorMessage.title'),
        }}
        messages={{
          title: t('errorMessage.title'),
          description: t('topicPage.articleErrorDescription'),
          back: t('errorMessage.back'),
          goToFrontPage: t('errorMessage.goToFrontPage'),
        }}
      />
    </div>
  </OneColumn>
);

TopicPageErrorMessage.propTypes = {};
