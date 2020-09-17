/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { OneColumn, ErrorMessage } from '@ndla/ui';
import { injectT } from '@ndla/i18n';
import { ArticleShape, ResourceShape } from '../shapes';
import { useGraphQuery } from '../util/runQueries';
import { plainArticleQuery } from '../queries';
import IframeArticlePage from './IframeArticlePage';
import IframeTopicPage from './IframeTopicPage';

if (process.env.NODE_ENV !== 'production') {
  // Can't require in production because of multiple asses emit to the same filename..
  require('../style/index.css'); // eslint-disable-line global-require
}

const Error = injectT(({ t }) => (
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
));

export const IframePage = ({
  status,
  locale,
  resource,
  location,
  article,
  isTopicArticle,
}) => {
  const articleId = (isTopicArticle ? article.id : resource.article.id).toString();
  const { error, loading, data } = useGraphQuery(plainArticleQuery, {
    variables: { articleId }
  });

  if (status !== 'success' || error) {
    return <Error />;
  }
  if (resource && !loading) {
    return (
      <IframeArticlePage
        locale={locale.abbreviation}
        resource={resource}
        article={data.article}
        location={location}
      />
    );
  }

  if (article && isTopicArticle) {
    return (
      <IframeTopicPage
        locale={locale.abbreviation}
        article={article}
        location={location}
      />
    );
  }
  return null;
};

IframePage.propTypes = {
  basename: PropTypes.string,
  locale: PropTypes.shape({
    abbreviation: PropTypes.string.isRequired,
    messages: PropTypes.object.isRequired,
  }).isRequired,
  article: ArticleShape,
  resource: ResourceShape,
  status: PropTypes.oneOf(['success', 'error']),
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  isTopicArticle: PropTypes.bool,
};

IframePage.defaultProps = {
  isTopicArticle: false,
};
export default IframePage;
