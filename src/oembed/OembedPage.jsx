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
import { PageContainer, OneColumn } from 'ndla-ui';
import IntlProvider from 'ndla-i18n';
import { transformArticle } from '../containers/ArticlePage/article';
import Article from '../components/Article';
import { getArticleScripts } from '../util/getArticleScripts';
import { ArticleShape } from '../shapes';

const OembedPage = ({
  article: rawArticle,
  locale: { abbreviation: locale, messages },
}) => {
  const article = transformArticle(rawArticle, locale);
  const scripts = getArticleScripts(article);
  return (
    <IntlProvider locale={locale} messages={messages}>
      <PageContainer>
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
        <OneColumn cssModifier="clear">
          <Article article={article} locale={locale} label="test" />
        </OneColumn>
      </PageContainer>
    </IntlProvider>
  );
};

OembedPage.propTypes = {
  locale: PropTypes.shape({
    abbreviation: PropTypes.string.isRequired,
    messages: PropTypes.object.isRequired,
  }).isRequired,
  article: ArticleShape.isRequired,
};

export default OembedPage;
