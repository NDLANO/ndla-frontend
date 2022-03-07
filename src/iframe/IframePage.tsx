/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useLocation } from 'react-router';
import { OneColumn, ErrorMessage } from '@ndla/ui';
import { useTranslation } from 'react-i18next';
import { useGraphQuery } from '../util/runQueries';
import { iframeArticleQuery } from '../queries';
import IframeArticlePage from './IframeArticlePage';
import IframeTopicPage from './IframeTopicPage';
import { LocaleType } from '../interfaces';
import { GQLIframeArticleQuery } from '../graphqlTypes';

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
  locale?: LocaleType;
  articleId?: string;
  taxonomyId?: string;
  status?: 'success' | 'error';
  isOembed?: string;
  isTopicArticle?: boolean;
}

export const IframePage = ({
  status,
  locale,
  taxonomyId,
  articleId,
  isOembed,
  isTopicArticle = false,
}: Props) => {
  const location = useLocation();
  const includeResource = !isTopicArticle && taxonomyId !== undefined;
  const includeTopic = isTopicArticle;
  const { loading, data } = useGraphQuery<GQLIframeArticleQuery>(
    iframeArticleQuery,
    {
      variables: {
        articleId,
        isOembed,
        path: location.pathname,
        taxonomyId: taxonomyId || '',
        includeResource,
        includeTopic,
      },
    },
  );

  if (status !== 'success') {
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
    return (
      <IframeTopicPage
        article={article}
        topic={{ article, ...topic }}
        locale={locale}
      />
    );
  }
  return (
    <IframeArticlePage locale={locale} resource={resource} article={article} />
  );
};

export default IframePage;
