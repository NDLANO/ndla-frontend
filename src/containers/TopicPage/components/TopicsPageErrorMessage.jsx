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

export const TopicPageErrorMessage = ({ fetchTopicsFailed, t }) => (
  <OneColumn>
    <div className="c-article">
      <ErrorMessage
        messages={{
          title: t('errorMessage.title'),
          description: fetchTopicsFailed
            ? t('topicPage.topicErrorDescription')
            : t('topicPage.articleErrorDescription'),
          back: fetchTopicsFailed ? t('errorMessage.back') : undefined,
          goToFrontPage: fetchTopicsFailed
            ? t('errorMessage.goToFrontPage')
            : undefined,
        }}
      />
    </div>
  </OneColumn>
);

TopicPageErrorMessage.propTypes = {
  fetchTopicsFailed: PropTypes.bool.isRequired,
};
