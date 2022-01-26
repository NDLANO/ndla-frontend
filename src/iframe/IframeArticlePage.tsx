/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { Helmet } from 'react-helmet';

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
import { LocaleType } from '../interfaces';
import { GQLArticle, GQLResource } from '../graphqlTypes';

interface Props extends CustomWithTranslation {
  locale?: LocaleType;
  resource?: GQLResource;
  article: GQLArticle;
}

const IframeArticlePage = ({
  resource,
  locale: propsLocale,
  t,
  article: propsArticle,
  i18n,
}: Props) => {
  const locale = propsLocale ?? i18n.language;
  const article = transformArticle(propsArticle, locale);
  const scripts = getArticleScripts(article);
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
        image={article.metaImage}
        description={article.metaDescription}
        locale={locale}
        trackableContent={article}
      />
      <PostResizeMessage />
      <FixDialogPosition />
      <Article article={article} locale={locale} {...getArticleProps(resource)}>
        <CreatedBy
          name={t('createdBy.content')}
          description={t('createdBy.text')}
          url={contentUrl}
        />
      </Article>
    </OneColumn>
  );
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
