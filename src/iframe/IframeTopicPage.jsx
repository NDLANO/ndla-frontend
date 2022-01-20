/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { withTracker } from '@ndla/tracker';
import { OneColumn, CreatedBy, constants } from '@ndla/ui';
import { withTranslation } from 'react-i18next';
import { transformArticle } from '../util/transformArticle';
import Article from '../components/Article';
import { getArticleScripts } from '../util/getArticleScripts';
import { ArticleShape, LocationShape, TopicShape } from '../shapes';
import PostResizeMessage from './PostResizeMessage';
import FixDialogPosition from './FixDialogPosition';
import SocialMediaMetadata from '../components/SocialMediaMetadata';
import getStructuredDataFromArticle from '../util/getStructuredDataFromArticle';
import config from '../config';

export class IframeTopicPage extends Component {
  static willTrackPageView(trackPageView, currentProps) {
    const { topic } = currentProps;
    if (topic?.article?.id) {
      trackPageView(currentProps);
    }
  }

  static getDocumentTitle({ t, topic }) {
    if (topic?.article?.id) {
      return `NDLA | ${topic.article.title.title}`;
    }
    return '';
  }

  render() {
    const {
      locale,
      article: propArticle,
      topic,
      skipToContentId,
      location,
      t,
    } = this.props;
    const article = transformArticle(propArticle, locale);
    const scripts = getArticleScripts(article);
    const contentUrl = topic.path
      ? `${config.ndlaFrontendDomain}${topic.path}`
      : undefined;
    return (
      <>
        <Helmet>
          <title>{`${this.constructor.getDocumentTitle(this.props)}`}</title>
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
            />
          ))}
          <script type="application/ld+json">
            {JSON.stringify(getStructuredDataFromArticle(propArticle))}
          </script>
        </Helmet>
        {article && (
          <SocialMediaMetadata
            description={article.metaDescription}
            image={article.metaImage}
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
            contentType={constants.contentTypes.TOPIC}>
            <CreatedBy
              name={t('createdBy.content')}
              description={t('createdBy.text')}
              url={contentUrl}
            />
          </Article>
        </OneColumn>
      </>
    );
  }
}

IframeTopicPage.propTypes = {
  locale: PropTypes.string.isRequired,
  location: LocationShape,
  article: ArticleShape,
  topic: TopicShape,
  status: PropTypes.oneOf(['success', 'error']),
  skipToContentId: PropTypes.string,
};

export default withTranslation()(withTracker(IframeTopicPage));
