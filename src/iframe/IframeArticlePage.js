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
import { OneColumn } from '@ndla/ui';
import { transformArticle } from '../util/transformArticle';
import Article from '../components/Article';
import { getArticleScripts } from '../util/getArticleScripts';
import { ArticleShape, ResourceTypeShape } from '../shapes';
import { getArticleProps } from '../util/getArticleProps';
import PostResizeMessage from './PostResizeMessage';
import FixDialogPosition from './FixDialogPosition';
import { SocialMediaMetadata } from '../components/SocialMediaMetadata';

export class IframeArticlePage extends React.Component {
  static willTrackPageView(trackPageView, currentProps) {
    const { resource } = currentProps;
    if (resource && resource.article && resource.article.id) {
      trackPageView(currentProps);
    }
  }

  static getDocumentTitle({ t, resource }) {
    if (resource && resource.article && resource.article.id) {
      return `NDLA | ${resource.article.title.title}`;
    }
    return '';
  }
  render() {
    const { resource, locale, location } = this.props;
    const article = transformArticle(resource.article, locale);
    const scripts = getArticleScripts(article);
    return (
      <OneColumn>
        <Helmet>
          <title>{`NDLA | ${article.title}`}</title>
          {scripts.map(script => (
            <script
              key={script.src}
              src={script.src}
              type={script.type}
              async={script.async}
            />
          ))}
        </Helmet>
        <SocialMediaMetadata
          title={article.title}
          location={location}
          image={article && article.image && { src: article.image.url }}
          description={article.metaDescription}
          locale={locale}
          trackableContent={article}
        />
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
  }
}

IframeArticlePage.propTypes = {
  locale: PropTypes.string.isRequired,
  resource: PropTypes.shape({
    article: ArticleShape,
    resourceTypes: PropTypes.arrayOf(ResourceTypeShape),
  }),
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
};
