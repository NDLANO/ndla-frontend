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

import { OneColumn, CreatedBy } from '@ndla/ui';
import { withTracker } from '@ndla/tracker';
import { withTranslation } from 'react-i18next';
import { transformArticle } from '../util/transformArticle';
import Article from '../components/Article';
import { getArticleScripts } from '../util/getArticleScripts';
import { ResourceShape, ArticleShape, LocationShape } from '../shapes';
import { getArticleProps } from '../util/getArticleProps';
import { getAllDimensions } from '../util/trackingUtil';
import PostResizeMessage from './PostResizeMessage';
import FixDialogPosition from './FixDialogPosition';
import { SocialMediaMetadata } from '../components/SocialMediaMetadata';
import { fetchResource } from '../containers/Resources/resourceApi';
import config from '../config';

export const fetchResourceId = props => {
  const paths = props.location.pathname.split('/');
  return paths.find(path => path.startsWith('urn'));
};

class IframeArticlePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      path: undefined,
    };
  }

  componentDidMount() {
    fetchResource(fetchResourceId(this.props), this.props.locale)
      .then(resource => {
        this.setState({
          path: resource.path || resource.paths?.[0],
        });
      })
      .catch(error => {});
  }

  static willTrackPageView(trackPageView, currentProps) {
    const { resource } = currentProps;
    if (resource?.article?.id) {
      trackPageView(currentProps);
    }
  }

  static getDimensions(props) {
    const articleProps = getArticleProps(props.resource);
    const {
      resource: { article },
    } = props;
    return getAllDimensions({ article }, articleProps.label, true);
  }

  static getDocumentTitle({ t, resource }) {
    if (resource?.article?.id) {
      return `NDLA | ${resource.article.title}`;
    }
    return '';
  }
  render() {
    const { resource, locale, location, t } = this.props;
    const article = transformArticle(this.props.article, locale);
    const scripts = getArticleScripts(article);
    const contentUrl = this.state.path
      ? `${config.ndlaFrontendDomain}${this.state.path}`
      : undefined;
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
          {...getArticleProps(resource)}>
          <CreatedBy
            name={t('createdBy.content')}
            description={t('createdBy.text')}
            url={contentUrl}
          />
        </Article>
      </OneColumn>
    );
  }
}

IframeArticlePage.propTypes = {
  locale: PropTypes.string.isRequired,
  resource: ResourceShape,
  article: ArticleShape,
  location: LocationShape,
};

export default withTranslation()(withTracker(IframeArticlePage));
