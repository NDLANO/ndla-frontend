/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { ReactNode } from 'react';
import { OneColumn, ErrorMessage } from '@ndla/ui';
import { useTranslation } from 'react-i18next';

interface Props {
  status: string;
  children: ReactNode;
}

const ArticleErrorMessage = ({ status, children }: Props) => {
  const { t } = useTranslation();
  return (
    <OneColumn>
      <article className="c-article--clean">
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
};

export default ArticleErrorMessage;
