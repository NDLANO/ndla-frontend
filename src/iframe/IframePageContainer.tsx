/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Helmet } from 'react-helmet-async';
import { PageContainer } from '@ndla/ui';
import IframePage from './IframePage';
import { isValidLocale } from '../i18n';
import { BaseNameProvider } from '../components/BaseNameContext';
import { LocaleType } from '../interfaces';

interface Props {
  locale?: LocaleType;
  basename?: string;
  articleId?: string;
  taxonomyId?: string;
  status?: 'success' | 'error';
  isOembed?: string;
  isTopicArticle?: boolean;
}
const IframePageContainer = ({
  basename,
  status,
  taxonomyId,
  articleId,
  isOembed,
  isTopicArticle,
  locale,
}: Props) => {
  return (
    <BaseNameProvider value={isValidLocale(basename) ? basename : ''}>
      <PageContainer>
        <Helmet htmlAttributes={{ lang: locale }} />
        <IframePage
          status={status}
          taxonomyId={taxonomyId}
          articleId={articleId}
          isOembed={isOembed}
          isTopicArticle={isTopicArticle}
        />
      </PageContainer>
    </BaseNameProvider>
  );
};

export default IframePageContainer;
