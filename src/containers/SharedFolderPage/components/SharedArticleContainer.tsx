/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from '@apollo/client';
import { OneColumn } from '@ndla/ui';
import { useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import Article from '../../../components/Article';
import config from '../../../config';
import { SKIP_TO_CONTENT_ID } from '../../../constants';
import {
  GQLFolderResourceMetaSearchQuery,
  GQLSharedResourceArticleContainer_ArticleFragment,
} from '../../../graphqlTypes';
import { getArticleProps } from '../../../util/getArticleProps';
import { getArticleScripts } from '../../../util/getArticleScripts';
import { getContentTypeFromResourceTypes } from '../../../util/getContentType';
import { structuredArticleDataFragment } from '../../../util/getStructuredDataFromArticle';
import { transformArticle } from '../../../util/transformArticle';

interface Props {
  article: GQLSharedResourceArticleContainer_ArticleFragment;
  meta?: GQLFolderResourceMetaSearchQuery['folderResourceMetaSearch'][0];
}

const SharedArticleContainer = ({ article: propArticle, meta }: Props) => {
  const { i18n } = useTranslation();

  useEffect(() => {
    if (window.MathJax && typeof window.MathJax.typeset === 'function') {
      try {
        window.MathJax.typeset();
      } catch (err) {
        // do nothing
      }
    }
  });

  const [article, scripts] = useMemo(() => {
    return [
      transformArticle(propArticle, i18n.language, {
        enabled: true,
        path: `${config.ndlaFrontendDomain}/article/${propArticle.id}`,
      }),
      getArticleScripts(propArticle, i18n.language),
    ];
  }, [propArticle, i18n.language]);

  const contentType =
    meta?.resourceTypes && getContentTypeFromResourceTypes(meta.resourceTypes);

  return (
    <OneColumn>
      <Helmet>
        {scripts.map(script => (
          <script
            key={script.src}
            src={script.src}
            type={script.type}
            async={script.async}
            defer={script.defer}
          />
        ))}
      </Helmet>
      <Article
        contentTransformed
        id={SKIP_TO_CONTENT_ID}
        article={article}
        {...getArticleProps(undefined, undefined)}
        contentType={contentType?.contentType}
        label={contentType?.label || ''}
      />
    </OneColumn>
  );
};

export default SharedArticleContainer;

export const sharedArticleContainerFragments = {
  article: gql`
    fragment SharedResourceArticleContainer_Article on Article {
      created
      tags
      ...Article_Article
      ...StructuredArticleData
    }
    ${structuredArticleDataFragment}
    ${Article.fragments.article}
  `,
};
