/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { Helmet } from 'react-helmet';
import { OneColumn } from '@ndla/ui';
import { withTracker } from '@ndla/tracker';
import { useTranslation } from 'react-i18next';
import DefaultErrorMessage from '../../components/DefaultErrorMessage';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import { transformArticle } from '../../util/transformArticle';
import Article from '../../components/Article';
import { getArticleScripts } from '../../util/getArticleScripts';
import { htmlTitle } from '../../util/titleHelper';
import getStructuredDataFromArticle from '../../util/getStructuredDataFromArticle';
import { getArticleProps } from '../../util/getArticleProps';
import { getAllDimensions } from '../../util/trackingUtil';
import SocialMediaMetadata from '../../components/SocialMediaMetadata';
import { plainArticleQuery } from '../../queries';
import { useGraphQuery } from '../../util/runQueries';

const getTitle = article => article?.title || '';

const getDocumentTitle = ({ t, article }) => {
  return htmlTitle(getTitle(article), [t('htmlTitles.titleTemplate')]);
};

const PlainArticlePage = ({
  locale,
  skipToContentId,
  match: {
    url,
    params: { articleId },
  },
}) => {
  const { t } = useTranslation();
  const { loading, data } = useGraphQuery(plainArticleQuery, {
    variables: { articleId, isOembed: 'false', path: url },
  });

  useEffect(() => {
    if (window.MathJax && typeof window.MathJax.typeset === 'function') {
      window?.MathJax?.typeset();
    }
  });

  if (loading) {
    return null;
  }

  if (!data) {
    return <DefaultErrorMessage />;
  }
  if (!data.article) {
    return <NotFoundPage />;
  }

  const article = transformArticle(data.article, locale);
  const scripts = getArticleScripts(article);

  return (
    <div>
      <Helmet>
        <title>{`${getDocumentTitle({ t, article })}`}</title>
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
            defer={script.defer}
          />
        ))}

        <script type="application/ld+json">
          {JSON.stringify(getStructuredDataFromArticle(data.article))}
        </script>
      </Helmet>
      <SocialMediaMetadata
        title={article.title}
        description={article.metaDescription}
        locale={locale}
        image={article.metaImage}
        trackableContent={article}
      />
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
    url: PropTypes.string,
    params: PropTypes.shape({
      articleId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  locale: PropTypes.string.isRequired,
  skipToContentId: PropTypes.string,
};

export default withTracker(PlainArticlePage);
