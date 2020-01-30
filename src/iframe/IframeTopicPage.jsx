/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { injectT } from '@ndla/i18n';
import { withTracker } from '@ndla/tracker';
import { OneColumn, constants } from '@ndla/ui';
import { transformArticle } from '../util/transformArticle';
import Article from '../components/Article';
import { getArticleScripts } from '../util/getArticleScripts';
import { ArticleShape, ResourceTypeShape, LocationShape } from '../shapes';
import { getArticleProps } from '../util/getArticleProps';
import PostResizeMessage from './PostResizeMessage';
import FixDialogPosition from './FixDialogPosition';
import { SocialMediaMetadata } from '../components/SocialMediaMetadata';
import getStructuredDataFromArticle from '../util/getStructuredDataFromArticle';

const Success = ({ resource, locale, location }) => {
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
        isTopicArticle
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
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
};

export class IframeTopicPage extends Component {
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
    const {
      locale,
      article: propArticle,
      skipToContentId,
      location,
      t,
    } = this.props;
    const article = transformArticle(propArticle, locale);
    const scripts = getArticleScripts(article);

    const metaImage =
      article &&
      article.metaData &&
      article.metaData.images &&
      article.metaData.images.length > 0
        ? article.metaData.images[0]
        : undefined;
    return (
      <>
        <Helmet>
          <title>{`${this.constructor.getDocumentTitle(this.props)}`}</title>
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
        {article && (
          <SocialMediaMetadata
            description={article.metaDescription}
            image={metaImage}
            title={article.title}
            trackableContent={article}
            locale={locale}
            location={location}
          />
        )}
        <PostResizeMessage />
        <FixDialogPosition />
        <OneColumn>
          <Article
            id={skipToContentId}
            isTopicArticle
            article={article}
            locale={locale}
            modifier="clean iframe"
            label={t('topicPage.topic')}
            contentType={constants.contentTypes.SUBJECT}></Article>
        </OneColumn>
      </>
    );
  }
}

IframeTopicPage.propTypes = {
  locale: PropTypes.shape({
    abbreviation: PropTypes.string.isRequired,
    messages: PropTypes.object.isRequired,
  }).isRequired,
  location: LocationShape,
  article: ArticleShape,
  status: PropTypes.oneOf(['success', 'error']),
  skipToContentId: PropTypes.string,
};

export default injectT(withTracker(IframeTopicPage));
