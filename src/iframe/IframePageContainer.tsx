/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { i18nInstance } from '@ndla/ui';
import IframePageWrapper from './IframePageWrapper';
import IframePage from './IframePage';
import { LocaleType } from '../interfaces';

interface Props {
  basename?: string;
  locale?: LocaleType;
  articleId?: string;
  taxonomyId?: string;
  status?: 'success' | 'error';
  isOembed?: string;
  isTopicArticle?: boolean;
  resCookie?: string;
}
const IframePageContainer = ({
  basename,
  status,
  locale,
  taxonomyId,
  articleId,
  isOembed,
  isTopicArticle,
  resCookie,
}: Props) => {
  return (
    <I18nextProvider i18n={i18nInstance}>
      <IframePageWrapper
        basename={basename}
        resCookie={resCookie}
        locale={locale}>
        <IframePage
          status={status}
          locale={locale}
          taxonomyId={taxonomyId}
          articleId={articleId}
          isOembed={isOembed}
          isTopicArticle={isTopicArticle}
        />
      </IframePageWrapper>
    </I18nextProvider>
  );
};

export default IframePageContainer;
