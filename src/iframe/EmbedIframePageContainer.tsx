/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Helmet } from 'react-helmet-async';
import { PageContainer } from '@ndla/ui';
import { isValidLocale } from '../i18n';
import { BaseNameProvider } from '../components/BaseNameContext';
import { LocaleType } from '../interfaces';
import EmbedIframePage from './EmbedIframePage';

interface Props {
  basename?: string;
  embedType?: string;
  embedId?: string;
  locale?: LocaleType;
}
const EmbedIframePageContainer = ({
  basename,
  embedType,
  embedId,
  locale,
}: Props) => {
  return (
    <BaseNameProvider value={isValidLocale(basename) ? basename : ''}>
      <PageContainer>
        <Helmet htmlAttributes={{ lang: locale }} />
        <EmbedIframePage embedId={embedId} embedType={embedType} />
      </PageContainer>
    </BaseNameProvider>
  );
};

export default EmbedIframePageContainer;
