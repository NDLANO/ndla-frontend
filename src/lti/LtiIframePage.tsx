/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { PageContainer } from '@ndla/ui';
import IframePage from '../iframe/IframePage';

export const LtiIframePage = () => {
  const { taxonomyId, articleId, lang } = useParams();
  return (
    <PageContainer>
      <Helmet htmlAttributes={{ lang: lang === 'nb' ? 'no' : lang }} />
      <IframePage
        status="success"
        taxonomyId={taxonomyId}
        articleId={articleId}
      />
    </PageContainer>
  );
};
