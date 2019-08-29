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
import { withTracker } from '@ndla/tracker';
import { PageContainer, OneColumn, ErrorMessage } from '@ndla/ui';
import IntlProvider, { injectT } from '@ndla/i18n';
import { ApolloProvider } from 'react-apollo';
import { MissingRouterContext } from '@ndla/safelink';
import { transformArticle } from '../util/transformArticle';
import Article from '../components/Article';
import { getArticleScripts } from '../util/getArticleScripts';
import { ArticleShape, ResourceTypeShape, LearningpathShape } from '../shapes';
import { getArticleProps } from '../util/getArticleProps';
import PostResizeMessage from './PostResizeMessage';
import FixDialogPosition from './FixDialogPosition';
import { createApolloClient } from '../util/apiHelpers';
import { SocialMediaMetadata } from '../components/SocialMediaMetadata';
import Learningpath from '../components/Learningpath';

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

const SuccessArticle = ({ resource, locale, location }) => {
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
};

SuccessArticle.propTypes = {
  locale: PropTypes.string.isRequired,
  resource: PropTypes.shape({
    article: ArticleShape,
    resourceTypes: PropTypes.arrayOf(ResourceTypeShape),
  }),
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
};

const SuccessLearningpath = ({ resource, locale, location }) => {
  const { learningpath } = resource;
  const learningpathStep = learningpath.learningsteps.find(
    step => step.seqNo === 0,
  );
  return (
    <div>
      <Helmet>
        <title>{`NDLA | ${learningpath.title}`}</title>
      </Helmet>
      <SocialMediaMetadata
        title={`${learningpath.title} - ${learningpathStep.title}`}
        trackableContent={learningpath}
        description={learningpath.description}
        locale={locale}
        location={location}
        image={{
          src: learningpath.coverphoto ? learningpath.coverphoto.url : '',
        }}
      />
      <Learningpath
        inIframe
        learningpath={learningpath}
        learningpathStep={learningpathStep}
        locale={locale}
        {...getArticleProps()}
      />
    </div>
  );
};

SuccessLearningpath.propTypes = {
  locale: PropTypes.string.isRequired,
  resource: PropTypes.shape({
    learningpath: LearningpathShape,
    resourceTypes: PropTypes.arrayOf(ResourceTypeShape),
  }),
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
};

const Success = ({ resource, locale, location }) => {
  if (resource.article) {
    return (
      <SuccessArticle resource={resource} locale={locale} location={location} />
    );
  }
  if (resource.learningpath) {
    return (
      <SuccessLearningpath
        resource={resource}
        locale={locale}
        location={location}
      />
    );
  }
};

Success.propTypes = {
  locale: PropTypes.string.isRequired,
  resource: PropTypes.shape({
    article: ArticleShape,
    learningpath: LearningpathShape,
    resourceTypes: PropTypes.arrayOf(ResourceTypeShape),
  }),
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
};

export class IframeArticlePage extends Component {
  static willTrackPageView(trackPageView, currentProps) {
    const { resource } = currentProps;
    if (resource && resource.article && resource.article.id) {
      trackPageView(currentProps);
    }
  }

  static getDocumentTitle({ t, resource }) {
    console.log(resource);
    if (resource && resource.article && resource.article.id) {
      return `NDLA | ${resource.article.title.title}`;
    }
    return '';
  }

  render() {
    const {
      status,
      locale: { abbreviation: locale, messages },
      resource,
      location,
    } = this.props;
    console.log(this.props);
    return (
      <ApolloProvider client={createApolloClient(locale)}>
        <IntlProvider locale={locale} messages={messages}>
          <MissingRouterContext.Provider value={true}>
            <PageContainer>
              <Helmet htmlAttributes={{ lang: locale }} />
              {status === 'success' ? (
                <Success
                  locale={locale}
                  resource={resource}
                  location={location}
                />
              ) : (
                <Error />
              )}
            </PageContainer>
          </MissingRouterContext.Provider>
        </IntlProvider>
      </ApolloProvider>
    );
  }
}

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
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
};

export default withTracker(IframeArticlePage);
