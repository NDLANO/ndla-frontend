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
import { useTranslation } from 'react-i18next';
import { ResourceTypeShape } from '../shapes';
import { useGraphQuery } from '../util/runQueries';
import { plainArticleQuery } from '../queries';
import IframeArticlePage from './IframeArticlePage';
import IframeTopicPage from './IframeTopicPage';

if (process.env.NODE_ENV !== 'production') {
  // Can't require in production because of multiple asses emit to the same filename..
  require('../style/index.css'); // eslint-disable-line global-require
}

const Error = () => {
  const {t} = useTranslation();
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
)};

export const IframePage = ({
  status,
  locale,
  resourceTypes,
  location,
  articleId,
  isOembed,
  isTopicArticle,
}) => {
  const { error, loading, data } = useGraphQuery(plainArticleQuery, {
    variables: { articleId, isOembed, path: location.pathname },
  });

  if (status !== 'success' || error) {
    return <Error />;
  }

  if (!loading) {
    const { article } = data;
    if (isTopicArticle) {
      return (
        <IframeTopicPage
          locale={locale.abbreviation}
          article={article}
          location={location}
        />
      );
    }
    return (
      <IframeArticlePage
        locale={locale.abbreviation}
        resource={{ article, resourceTypes }}
        article={article}
        location={location}
      />
    );
  }
  return null;
};

IframePage.propTypes = {
  locale: PropTypes.shape({
    abbreviation: PropTypes.string.isRequired,
    messages: PropTypes.object.isRequired,
  }).isRequired,
  articleId: PropTypes.string,
  resourceTypes: PropTypes.arrayOf(ResourceTypeShape),
  status: PropTypes.oneOf(['success', 'error']),
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  isOembed: PropTypes.string,
  isTopicArticle: PropTypes.bool,
};

IframePage.defaultProps = {
  isTopicArticle: false,
};
export default IframePage;
