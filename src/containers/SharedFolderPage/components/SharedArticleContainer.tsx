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
import { TFunction, useTranslation } from 'react-i18next';
import { useTracker } from '@ndla/tracker';
import { DynamicComponents } from '@ndla/article-converter';
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
import { getAllDimensions } from '../../../util/trackingUtil';
import AddEmbedToFolder from '../../../components/MyNdla/AddEmbedToFolder';

interface Props {
  article: GQLSharedResourceArticleContainer_ArticleFragment;
  meta?: GQLFolderResourceMetaSearchQuery['folderResourceMetaSearch'][0];
  title: string;
}

const converterComponents: DynamicComponents = {
  heartButton: AddEmbedToFolder,
};

const SharedArticleContainer = ({ article: propArticle, meta }: Props) => {
  const { t, i18n } = useTranslation();
  const { trackPageView } = useTracker();
  useEffect(() => {
    if (window.MathJax && typeof window.MathJax.typeset === 'function') {
      try {
        window.MathJax.typeset();
      } catch (err) {
        // do nothing
      }
    }
  });

  useEffect(() => {
    if (propArticle) {
      const dimensions = getAllDimensions(
        { article: propArticle },
        meta?.resourceTypes &&
          getContentTypeFromResourceTypes(meta.resourceTypes)?.label,
        true,
      );
      trackPageView({
        dimensions,
        title: getDocumentTitle(propArticle.title, t),
      });
    }
  }, [meta?.resourceTypes, propArticle, t, trackPageView]);

  const [article, scripts] = useMemo(() => {
    return [
      transformArticle(propArticle, i18n.language, {
        path: `${config.ndlaFrontendDomain}/article/${propArticle.id}`,
        components: converterComponents,
      }),
      getArticleScripts(propArticle, i18n.language),
    ];
  }, [propArticle, i18n.language]);

  const contentType =
    meta?.resourceTypes && getContentTypeFromResourceTypes(meta.resourceTypes);

  return (
    <OneColumn>
      <Helmet>
        {scripts.map((script) => (
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

const getDocumentTitle = (title: string, t: TFunction) =>
  t('htmlTitles.sharedFolderPage', { name: title });

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
