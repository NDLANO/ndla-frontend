/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from '@apollo/client';
import { useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { TFunction, useTranslation } from 'react-i18next';
import { FeideUserApiType, OneColumn } from '@ndla/ui';
import { useTracker } from '@ndla/tracker';
import { DynamicComponents } from '@ndla/article-converter';
import { transformArticle } from '../../util/transformArticle';
import { getArticleScripts } from '../../util/getArticleScripts';
import Article from '../../components/Article';
import SocialMediaMetadata from '../../components/SocialMediaMetadata';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import getStructuredDataFromArticle, {
  structuredArticleDataFragment,
} from '../../util/getStructuredDataFromArticle';
import { htmlTitle } from '../../util/titleHelper';
import { GQLPlainArticleContainer_ArticleFragment } from '../../graphqlTypes';
import config from '../../config';
import { getArticleProps } from '../../util/getArticleProps';
import { getAllDimensions } from '../../util/trackingUtil';
import AddEmbedToFolder from '../../components/MyNdla/AddEmbedToFolder';

interface Props {
  article: GQLPlainArticleContainer_ArticleFragment;
  user?: FeideUserApiType;
  skipToContentId?: string;
}

const converterComponents: DynamicComponents | undefined =
  config.favoriteEmbedEnabled ? { heartButton: AddEmbedToFolder } : undefined;

const getDocumentTitle = (t: TFunction, title: string) =>
  htmlTitle(title, [t('htmlTitles.titleTemplate')]);

const PlainArticleContainer = ({
  article: propArticle,
  skipToContentId,
  user,
}: Props) => {
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
    if (!propArticle) return;
    const dims = getAllDimensions(
      { article: propArticle, user },
      undefined,
      true,
    );
    trackPageView({
      dimensions: dims.gtm,
      title: getDocumentTitle(t, propArticle.title),
    });
  }, [propArticle, t, trackPageView, user]);

  const [article, scripts] = useMemo(() => {
    return [
      transformArticle(propArticle, i18n.language, {
        path: `${config.ndlaFrontendDomain}/article/${propArticle.id}`,
        components: converterComponents,
      }),
      getArticleScripts(propArticle, i18n.language),
    ];
  }, [propArticle, i18n.language]);

  if (!article) return <NotFoundPage />;
  const oembedUrl = `${config.ndlaFrontendDomain}/oembed?url=${config.ndlaFrontendDomain}/article/${article.id}`;

  return (
    <div>
      <Helmet>
        <title>{`${getDocumentTitle(t, article.title)}`}</title>
        <meta name="robots" content="noindex" />
        {scripts.map((script) => (
          <script
            key={script.src}
            src={script.src}
            type={script.type}
            async={script.async}
            defer={script.defer}
          />
        ))}
        {oembedUrl && (
          <link
            rel="alternate"
            type="application/json+oembed"
            href={oembedUrl}
            title={article.title}
          />
        )}

        <script type="application/ld+json">
          {JSON.stringify(
            getStructuredDataFromArticle(propArticle, i18n.language),
          )}
        </script>
      </Helmet>
      <SocialMediaMetadata
        title={article.title}
        description={article.metaDescription}
        imageUrl={article.metaImage?.url}
        trackableContent={article}
      />
      <OneColumn>
        <Article
          contentTransformed
          isPlainArticle
          id={skipToContentId}
          article={article}
          {...getArticleProps(undefined, undefined)}
        />
      </OneColumn>
    </div>
  );
};

export const plainArticleContainerFragments = {
  article: gql`
    fragment PlainArticleContainer_Article on Article {
      created
      tags
      ...Article_Article
      ...StructuredArticleData
    }
    ${structuredArticleDataFragment}
    ${Article.fragments.article}
  `,
};
export default PlainArticleContainer;
