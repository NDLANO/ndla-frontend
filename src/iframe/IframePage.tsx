/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from '@apollo/client';
import { useLocation } from 'react-router-dom';
import { OneColumn, ErrorMessage } from '@ndla/ui';
import { useTranslation } from 'react-i18next';
import { useGraphQuery } from '../util/runQueries';
import IframeArticlePage, {
  iframeArticlePageFragments,
} from './IframeArticlePage';
import IframeTopicPage, { iframeTopicPageFragments } from './IframeTopicPage';
import {
  GQLIframePageQuery,
  GQLIframePageQueryVariables,
} from '../graphqlTypes';

if (process.env.NODE_ENV !== 'production') {
  // Can't require in production because of multiple asses emit to the same filename..
  require('../style/index.css'); // eslint-disable-line global-require
}

const Error = () => {
  const { t } = useTranslation();
  return (
    <OneColumn cssModifier="clear">
      <ErrorMessage
        illustration={{
          url: '/static/oops.gif',
          altText: t('errorMessage.title'),
        }}
        messages={{
          title: t('errorMessage.title'),
          description: t('errorMessage.description'),
        }}
      />
    </OneColumn>
  );
};

interface Props {
  articleId?: string;
  taxonomyId?: string;
  status?: 'success' | 'error';
  isOembed?: string;
  isTopicArticle?: boolean;
}

const iframePageQuery = gql`
  query iframePage(
    $articleId: String!
    $isOembed: String
    $path: String
    $taxonomyId: String!
    $includeResource: Boolean!
    $includeTopic: Boolean!
    $showVisualElement: String
  ) {
    article(
      id: $articleId
      isOembed: $isOembed
      path: $path
      showVisualElement: $showVisualElement
    ) {
      ...IframeTopicPage_Article
      ...IframeArticlePage_Article
    }
    resource(id: $taxonomyId) @include(if: $includeResource) {
      ...IframeArticlePage_Resource
    }
    topic(id: $taxonomyId) @include(if: $includeTopic) {
      ...IframeTopicPage_Topic
    }
  }
  ${iframeArticlePageFragments.resource}
  ${iframeArticlePageFragments.article}
  ${iframeTopicPageFragments.topic}
  ${iframeTopicPageFragments.article}
`;

export const IframePage = ({
  status,
  taxonomyId,
  articleId,
  isOembed,
  isTopicArticle = false,
}: Props) => {
  const location = useLocation();
  const includeResource = !isTopicArticle && taxonomyId !== undefined;
  const includeTopic = isTopicArticle;
  const { loading, data } = useGraphQuery<
    GQLIframePageQuery,
    GQLIframePageQueryVariables
  >(iframePageQuery, {
    variables: {
      articleId: articleId!,
      isOembed,
      path: location.pathname,
      taxonomyId: taxonomyId || '',
      includeResource,
      includeTopic,
      showVisualElement: isTopicArticle ? 'true' : 'false',
    },
    skip: !articleId,
  });

  if (status !== 'success' || !articleId) {
    return <Error />;
  }

  if (loading) {
    return null;
  }

  const { article, resource, topic } = data ?? {};
  // Only care if article can be rendered
  if (!article) {
    return <Error />;
  }

  if (isTopicArticle) {
    return <IframeTopicPage article={article} topic={topic} />;
  }
  return <IframeArticlePage resource={resource} article={article} />;
};

export default IframePage;
