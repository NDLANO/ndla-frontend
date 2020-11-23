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
import { injectT } from '@ndla/i18n';
import { withTracker } from '@ndla/tracker';
import { OneColumn, CreatedBy, constants } from '@ndla/ui';
import { transformArticle } from '../util/transformArticle';
import Article from '../components/Article';
import { getArticleScripts } from '../util/getArticleScripts';
import { ArticleShape, ResourceShape, LocationShape } from '../shapes';
import { getArticleProps } from '../util/getArticleProps';
import PostResizeMessage from './PostResizeMessage';
import FixDialogPosition from './FixDialogPosition';
import { SocialMediaMetadata } from '../components/SocialMediaMetadata';
import getStructuredDataFromArticle from '../util/getStructuredDataFromArticle';
import { fetchTopic } from '../containers/Resources/resourceApi';
import config from '../config';

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
            defer={script.defer}
          />
        ))}
      </Helmet>
      <SocialMediaMetadata
        title={article.title}
        location={location}
        image={article.metaImage}
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
  resource: ResourceShape,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
};

export class IframeTopicPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      path: undefined,
    };
  }

  componentDidMount() {
    const topicId = this.props.location.pathname.split('/')[3];
    fetchTopic(topicId).then(topic => {
      this.setState({
        path: topic.path || topic.paths?.[0],
      });
    });
  }
  static willTrackPageView(trackPageView, currentProps) {
    const { resource } = currentProps;
    if (resource?.article?.id) {
      trackPageView(currentProps);
    }
  }

  static getDocumentTitle({ t, resource }) {
    if (resource?.article?.id) {
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
    const contentUrl = this.state.path
      ? `${config.ndlaFrontendDomain}/subjects${this.state.path}`
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
            contentType={constants.contentTypes.SUBJECT}>
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
