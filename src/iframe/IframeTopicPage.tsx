/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useMemo } from 'react';
import { gql } from '@apollo/client';
import { Helmet } from 'react-helmet-async';
import { useTracker } from '@ndla/tracker';
import { OneColumn, CreatedBy, constants } from '@ndla/ui';
import { useTranslation } from 'react-i18next';
import { transformArticle } from '../util/transformArticle';
import Article from '../components/Article';
import { getArticleScripts } from '../util/getArticleScripts';
import PostResizeMessage from './PostResizeMessage';
import SocialMediaMetadata from '../components/SocialMediaMetadata';
import getStructuredDataFromArticle, {
  structuredArticleDataFragment,
} from '../util/getStructuredDataFromArticle';
import config from '../config';
import {
  GQLIframeTopicPage_ArticleFragment,
  GQLIframeTopicPage_TopicFragment,
} from '../graphqlTypes';
import { LocaleType } from '../interfaces';
import { getAllDimensions } from '../util/trackingUtil';

interface Props {
  locale?: LocaleType;
  article: GQLIframeTopicPage_ArticleFragment;
  topic?: GQLIframeTopicPage_TopicFragment;
  status?: 'success' | 'error';
  skipToContentId?: string;
}

const getDocumentTitle = ({ article }: Pick<Props, 'article'>) => {
  if (article?.id) {
    return `NDLA | ${article.title}`;
  }
  return '';
};

export const IframeTopicPage = ({
  article: propArticle,
  topic,
  locale: localeProp,
}: Props) => {
  const { t, i18n } = useTranslation();
  const { trackPageView } = useTracker();
  const locale = localeProp ?? i18n.language;

  useEffect(() => {
    if (!propArticle?.id) return;
    const dimensions = getAllDimensions(
      { article: propArticle },
      undefined,
      true,
    );
    trackPageView({
      dimensions,
      title: getDocumentTitle({ article: propArticle }),
    });
  }, [propArticle, trackPageView]);

  const [article, scripts] = useMemo(() => {
    return [
      transformArticle(propArticle, locale, {
        path: `${config.ndlaFrontendDomain}/article/${propArticle.id}`,
        isOembed: true,
        articleLanguage: propArticle.language,
      }),
      getArticleScripts(propArticle, locale),
    ];
  }, [propArticle, locale]);

  const contentUrl = topic?.path
    ? `${config.ndlaFrontendDomain}${topic.path}`
    : undefined;
  return (
    <>
      <Helmet>
        <title>{`${getDocumentTitle({ article: propArticle })}`}</title>
        <meta name="robots" content="noindex" />
        {scripts.map((script) => (
          <script
            key={script.src}
            src={script.src}
            type={script.type}
            async={script.async}
          />
        ))}
        <script type="application/ld+json">
          {JSON.stringify(
            getStructuredDataFromArticle(propArticle, i18n.language),
          )}
        </script>
      </Helmet>
      {article && (
        <SocialMediaMetadata
          description={article.metaDescription}
          imageUrl={article.metaImage?.url}
          title={article.title}
          trackableContent={article}
        />
      )}
      <PostResizeMessage />
      <OneColumn>
        <main>
          <Article
            contentTransformed
            isTopicArticle
            article={article}
            label={t('topicPage.topic')}
            isPlainArticle
            isOembed
            contentType={constants.contentTypes.TOPIC}
          >
            <CreatedBy
              name={t('createdBy.content')}
              description={t('createdBy.text')}
              url={contentUrl}
            />
          </Article>
        </main>
      </OneColumn>
    </>
  );
};

export const iframeTopicPageFragments = {
  article: gql`
    fragment IframeTopicPage_Article on Article {
      created
      tags
      ...Article_Article
      ...StructuredArticleData
    }
    ${Article.fragments.article}
    ${structuredArticleDataFragment}
  `,
  topic: gql`
    fragment IframeTopicPage_Topic on Topic {
      path
    }
  `,
};

export default IframeTopicPage;
