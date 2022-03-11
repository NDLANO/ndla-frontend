/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Helmet } from 'react-helmet';
import { withTracker } from '@ndla/tracker';
import { OneColumn, CreatedBy, constants } from '@ndla/ui';
import { CustomWithTranslation, withTranslation } from 'react-i18next';
import { transformArticle } from '../util/transformArticle';
import Article from '../components/Article';
import { getArticleScripts } from '../util/getArticleScripts';
import PostResizeMessage from './PostResizeMessage';
import FixDialogPosition from './FixDialogPosition';
import SocialMediaMetadata from '../components/SocialMediaMetadata';
import getStructuredDataFromArticle from '../util/getStructuredDataFromArticle';
import config from '../config';
import { GQLArticleInfoFragment, GQLTopic } from '../graphqlTypes';
import { LocaleType } from '../interfaces';

interface Props extends CustomWithTranslation {
  locale?: LocaleType;
  article: GQLArticleInfoFragment;
  topic: Partial<Omit<GQLTopic, 'article'>> & {
    article?: GQLArticleInfoFragment;
  };
  status?: 'success' | 'error';
  skipToContentId?: string;
}

const getDocumentTitle = ({ topic }: Pick<Props, 'topic'>) => {
  if (topic?.article?.id) {
    return `NDLA | ${topic.article.title}`;
  }
  return '';
};

export const IframeTopicPage = ({
  locale: localeProp,
  article: propArticle,
  topic,
  t,
  i18n,
}: Props) => {
  const locale = localeProp ?? i18n.language;
  const article = transformArticle(propArticle, locale);
  const scripts = getArticleScripts(article);
  const contentUrl = topic.path
    ? `${config.ndlaFrontendDomain}${topic.path}`
    : undefined;
  return (
    <>
      <Helmet>
        <title>{`${getDocumentTitle({ topic })}`}</title>
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
          locale={locale}
        />
      )}
      <PostResizeMessage />
      <FixDialogPosition />
      <OneColumn>
        <Article
          isTopicArticle
          article={article}
          locale={locale}
          label={t('topicPage.topic')}
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

IframeTopicPage.getDocumentTitle = getDocumentTitle;

IframeTopicPage.willTrackPageView = (
  trackPageView: (currentProps: Props) => void,
  currentProps: Props,
) => {
  const { topic } = currentProps;
  if (topic?.article?.id) {
    trackPageView(currentProps);
  }
};

export default withTranslation()(withTracker(IframeTopicPage));
