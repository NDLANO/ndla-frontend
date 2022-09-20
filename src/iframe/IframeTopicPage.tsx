/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from '@apollo/client';
import { Helmet } from 'react-helmet-async';
import { withTracker } from '@ndla/tracker';
import { OneColumn, CreatedBy, constants } from '@ndla/ui';
import { CustomWithTranslation, withTranslation } from 'react-i18next';
import { transformArticle } from '../util/transformArticle';
import Article from '../components/Article';
import { getArticleScripts } from '../util/getArticleScripts';
import PostResizeMessage from './PostResizeMessage';
import FixDialogPosition from './FixDialogPosition';
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

interface Props extends CustomWithTranslation {
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
  t,
  i18n,
  locale: localeProp,
}: Props) => {
  const locale = localeProp ?? i18n.language;
  const article = transformArticle(propArticle, locale);
  const scripts = getArticleScripts(article);
  const contentUrl = topic?.path
    ? `${config.ndlaFrontendDomain}${topic.path}`
    : undefined;
  return (
    <>
      <Helmet>
        <title>{`${getDocumentTitle({ article })}`}</title>
        <meta name="robots" content="noindex" />
        {scripts.map(script => (
          <script
            key={script.src}
            src={script.src}
            type={script.type}
            async={script.async}
          />
        ))}
        <script type="application/ld+json">
          {JSON.stringify(getStructuredDataFromArticle(propArticle))}
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
      <FixDialogPosition />
      <OneColumn>
        <Article
          isTopicArticle
          article={article}
          label={t('topicPage.topic')}
          isPlainArticle
          isOembed
          contentType={constants.contentTypes.TOPIC}>
          <CreatedBy
            name={t('createdBy.content')}
            description={t('createdBy.text')}
            url={contentUrl}
          />
        </Article>
      </OneColumn>
    </>
  );
};

export const iframeTopicPageFragments = {
  article: gql`
    fragment IframeTopicPage_Article on Article {
      created
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

IframeTopicPage.getDocumentTitle = getDocumentTitle;

IframeTopicPage.willTrackPageView = (
  trackPageView: (currentProps: Props) => void,
  currentProps: Props,
) => {
  const { article } = currentProps;
  if (article?.id) {
    trackPageView(currentProps);
  }
};

export default withTranslation()(withTracker(IframeTopicPage));
