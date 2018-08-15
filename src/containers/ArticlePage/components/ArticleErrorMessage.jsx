/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { injectT } from 'ndla-i18n';
import { OneColumn, ErrorMessage } from 'ndla-ui';

const ArticleErrorMessage = ({ status, children, t }) => (
  <OneColumn>
    <article className="c-article">
      <ErrorMessage
        illustration={{
          url:
            status === 'error404'
              ? '/static/not-exist.gif'
              : '/static/oops.gif',
          altText: t('errorMessage.title'),
        }}
        messages={{
          title: t('errorMessage.title'),
          description:
            status === 'error404'
              ? t('articlePage.error404Description')
              : t('articlePage.errorDescription'),
          back: t('errorMessage.back'),
          goToFrontPage: t('errorMessage.goToFrontPage'),
        }}
      />
      {children}
    </article>
  </OneColumn>
);

ArticleErrorMessage.propTypes = {
  status: PropTypes.string.isRequired,
};

export default injectT(ArticleErrorMessage);
