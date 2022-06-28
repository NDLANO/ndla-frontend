/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from '@apollo/client';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { CustomWithTranslation, withTranslation } from 'react-i18next';
import { FeideUserApiType, OneColumn } from '@ndla/ui';
import { withTracker } from '@ndla/tracker';
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
import { LocaleType } from '../../interfaces';
import { getArticleProps } from '../../util/getArticleProps';
import { getAllDimensions } from '../../util/trackingUtil';

interface Props extends CustomWithTranslation {
  article: GQLPlainArticleContainer_ArticleFragment;
  locale: LocaleType;
  user?: FeideUserApiType;
  skipToContentId?: string;
}

const getDocumentTitle = ({ t, article }: Pick<Props, 't' | 'article'>) =>
  htmlTitle(article.title, [t('htmlTitles.titleTemplate')]);

const PlainArticleContainer = ({
  article: propArticle,
  locale,
  t,
  skipToContentId,
}: Props) => {
  useEffect(() => {
    if (window.MathJax && typeof window.MathJax.typeset === 'function') {
      window?.MathJax?.typeset();
    }
  });

  const article = transformArticle(propArticle, locale);
  if (!article) return <NotFoundPage />;
  const scripts = getArticleScripts(article);

  return (
    <div>
      <Helmet>
        <title>{`${getDocumentTitle({ t, article })}`}</title>
        <meta name="robots" content="noindex" />
        {article && article.metaDescription && (
          <meta name="description" content={article.metaDescription} />
        )}
        {scripts.map(script => (
          <script
            key={script.src}
            src={script.src}
            type={script.type}
            async={script.async}
            defer={script.defer}
          />
        ))}

        <script type="application/ld+json">
          {JSON.stringify(getStructuredDataFromArticle(propArticle))}
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
          isPlainArticle
          id={skipToContentId}
          article={article}
          locale={locale}
          {...getArticleProps(undefined, undefined)}
        />
      </OneColumn>
    </div>
  );
};

PlainArticleContainer.willTrackPageView = (
  trackPageView: (props: Props) => void,
  props: Props,
) => {
  if (props.article) {
    trackPageView(props);
  }
};

PlainArticleContainer.getDimensions = (props: Props) => {
  const { article, user } = props;
  return getAllDimensions({ article, user }, undefined, true);
};

PlainArticleContainer.getDocumentTitle = getDocumentTitle;

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
export default withTranslation()(withTracker(PlainArticleContainer));
