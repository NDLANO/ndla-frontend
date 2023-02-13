/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from 'react';
import { gql } from '@apollo/client';
import { Helmet } from 'react-helmet-async';
import { OneColumn, CreatedBy } from '@ndla/ui';
import { withTracker } from '@ndla/tracker';
import { CustomWithTranslation, withTranslation } from 'react-i18next';
import { transformArticle } from '../util/transformArticle';
import Article from '../components/Article';
import { getArticleScripts } from '../util/getArticleScripts';
import { getArticleProps } from '../util/getArticleProps';
import { getAllDimensions } from '../util/trackingUtil';
import PostResizeMessage from './PostResizeMessage';
import FixDialogPosition from './FixDialogPosition';
import SocialMediaMetadata from '../components/SocialMediaMetadata';
import config from '../config';
import {
  GQLIframeArticlePage_ArticleFragment,
  GQLIframeArticlePage_ResourceFragment,
} from '../graphqlTypes';
import { LocaleType } from '../interfaces';

interface Props extends CustomWithTranslation {
  locale?: LocaleType;
  resource?: GQLIframeArticlePage_ResourceFragment;
  article: GQLIframeArticlePage_ArticleFragment;
}

const IframeArticlePage = ({
  resource,
  t,
  article: propArticle,
  i18n,
  locale: propsLocale,
}: Props) => {
  const locale = propsLocale ?? i18n.language;
  const [article, scripts] = useMemo(() => {
    return [
      transformArticle(propArticle, locale, {
        enabled: !config.articleConverterEnabled,
        path: `${config.ndlaFrontendDomain}/article/${propArticle.id}`,
        isOembed: true,
      }),
      getArticleScripts(propArticle, locale),
    ];
  }, [propArticle, locale])!;
  const contentUrl = resource?.path
    ? `${config.ndlaFrontendDomain}${resource.path}`
    : undefined;
  return (
    <OneColumn>
      <Helmet>
        <title>{`NDLA | ${article.title}`}</title>
        <meta name="robots" content="noindex" />
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
      <SocialMediaMetadata
        title={article.title}
        imageUrl={article.metaImage?.url}
        description={article.metaDescription}
        trackableContent={article}
      />
      <PostResizeMessage />
      <FixDialogPosition />
      <main>
        <Article
          contentTransformed={!config.articleConverterEnabled}
          article={article}
          isPlainArticle
          isOembed
          modifier="clean iframe"
          {...getArticleProps(resource)}>
          <CreatedBy
            name={t('createdBy.content')}
            description={t('createdBy.text')}
            url={contentUrl}
          />
        </Article>
      </main>
    </OneColumn>
  );
};

export const iframeArticlePageFragments = {
  article: gql`
    fragment IframeArticlePage_Article on Article {
      created
      updated
      metaDescription
      metaImage {
        url
      }
      tags
      ...Article_Article
    }
    ${Article.fragments.article}
  `,
  resource: gql`
    fragment IframeArticlePage_Resource on Resource {
      id
      path
      resourceTypes {
        id
        name
      }
    }
  `,
};

IframeArticlePage.getDocumentTitle = ({ article }: Pick<Props, 'article'>) => {
  return article.id ? `NDLA | ${article.title}` : '';
};

IframeArticlePage.getDimensions = ({ resource, article }: Props) => {
  const articleProps = getArticleProps(resource?.id ? resource : undefined);
  return getAllDimensions({ article }, articleProps.label, true);
};

IframeArticlePage.willTrackPageView = (
  trackPageView: (props: Props) => void,
  currentProps: Props,
) => {
  const { article } = currentProps;
  if (article?.id) {
    trackPageView(currentProps);
  }
};

export default withTranslation()(withTracker(IframeArticlePage));
