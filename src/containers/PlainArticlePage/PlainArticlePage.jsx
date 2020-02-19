/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Helmet from 'react-helmet';
import { OneColumn } from '@ndla/ui';
import { injectT } from '@ndla/i18n';
import { withTracker } from '@ndla/tracker';
import { transformArticle } from '../../util/transformArticle';
import Article from '../../components/Article';
import ArticleHero from '../ArticlePage/components/ArticleHero';
import ArticleErrorMessage from '../ArticlePage/components/ArticleErrorMessage';
import { fetchArticle } from '../ArticlePage/articleApi';
import { getArticleScripts } from '../../util/getArticleScripts';
import getStructuredDataFromArticle from '../../util/getStructuredDataFromArticle';
import { getArticleProps } from '../../util/getArticleProps';
import { getAllDimensions } from '../../util/trackingUtil';
import SocialMediaMetadata from '../../components/SocialMediaMetadata';

const getTitle = article => article?.title || '';

const getDocumentTitle = ({ t, article }) => {
  return `${getTitle(article)}${t('htmlTitles.titleTemplate')}`;
};

const PlainArticlePage = ({
  t,
  locale,
  skipToContentId,
  match: {
    params: { articleId },
  },
}) => {
  const [rawArticle, setArticle] = useState({});
  const getArticle = async (articleId, locale) => {
    try {
      const article = await fetchArticle(articleId, locale);
      setArticle({ article, status: 'success' });
    } catch (error) {
      const status = error.json?.status === 404 ? 'error404' : 'error';
      setArticle({ status });
    }
  };
  useEffect(() => {
    if (window.MathJax) {
      window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub]);
    }
    if (!rawArticle.status) {
      getArticle(articleId, locale);
    }
  });

  if (!rawArticle.status) {
    return null;
  }

  if (rawArticle.status !== 'success') {
    return (
      <div>
        <ArticleHero resource={{}} />
        <ArticleErrorMessage status={rawArticle.status} />
      </div>
    );
  }

  const article = transformArticle(rawArticle.article, locale);
  const scripts = getArticleScripts(article);

  return (
    <div>
      <Helmet>
        <title>{`${getDocumentTitle({ t, article })}`}</title>
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
          {JSON.stringify(getStructuredDataFromArticle(article))}
        </script>
      </Helmet>
      <SocialMediaMetadata
        title={article.title}
        description={article.metaDescription}
        locale={locale}
        image={article.metaImage}
        trackableContent={article}
      />
      {article && <ArticleHero resource={{}} />}
      <OneColumn>
        <Article
          id={skipToContentId}
          article={article}
          locale={locale}
          {...getArticleProps()}
        />
      </OneColumn>
    </div>
  );
};

PlainArticlePage.willTrackPageView = (trackPageView, props) => {
  const { article } = props;
  if (article && article.id) {
    trackPageView(props);
  }
};

PlainArticlePage.getDimensions = props => {
  return getAllDimensions(props, undefined, true);
};

PlainArticlePage.getDocumentTitle = getDocumentTitle;

PlainArticlePage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      articleId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  locale: PropTypes.string.isRequired,
  skipToContentId: PropTypes.string,
};

export default injectT(withTracker(PlainArticlePage));
