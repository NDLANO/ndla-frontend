/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';

import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { PageContainer, OneColumn, ErrorMessage } from 'ndla-ui';
import IntlProvider, { injectT } from 'ndla-i18n';
import { transformArticle } from '../util/transformArticle';
import Article from '../components/Article';
import { getArticleScripts } from '../util/getArticleScripts';
import { ArticleShape, ResourceTypeShape } from '../shapes';
import { getArticleProps } from '../util/getArticleProps';
import PostResizeMessage from './PostResizeMessage';
import FixDialogPosition from './FixDialogPosition';

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

const Success = ({ resource, locale }) => {
  const article = transformArticle(resource.article, locale);
  const scripts = getArticleScripts(article);
  return (
    <OneColumn>
      <Helmet>
        <title>{`NDLA | ${article.title}`}</title>
        {article.metaDescription && (
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
      </Helmet>
      <PostResizeMessage />
      <FixDialogPosition />
      <Article
        article={article}
        locale={locale}
        modifier="clean iframe"
        {...getArticleProps(resource)}
      />
    </OneColumn>
  );
};

Success.propTypes = {
  locale: PropTypes.string.isRequired,
  resource: PropTypes.shape({
    article: ArticleShape,
    resourceTypes: PropTypes.arrayOf(ResourceTypeShape),
  }),
};

const IframeArticlePage = ({
  status,
  locale: { abbreviation: locale, messages },
  resource,
}) => (
  <IntlProvider locale={locale} messages={messages}>
    <PageContainer>
      <Helmet htmlAttributes={{ lang: locale }} />
      {status === 'success' && <Success locale={locale} resource={resource} />}
      {status === 'error' && <Error />}
    </PageContainer>
  </IntlProvider>
);

IframeArticlePage.propTypes = {
  locale: PropTypes.shape({
    abbreviation: PropTypes.string.isRequired,
    messages: PropTypes.object.isRequired,
  }).isRequired,
  resource: PropTypes.shape({
    article: ArticleShape,
    resourceTypes: PropTypes.arrayOf(ResourceTypeShape),
  }),
  status: PropTypes.oneOf(['success', 'error']),
};

export default IframeArticlePage;
