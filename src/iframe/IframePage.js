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
import { ArticleShape, ResourceTypeShape } from '../shapes';
import { getArticleProps } from '../util/getArticleProps';
import PostResizeMessage from './PostResizeMessage';
import FixDialogPosition from './FixDialogPosition';
import { createApolloClient } from '../util/apiHelpers';
import { SocialMediaMetadata } from '../components/SocialMediaMetadata';
import { IframeArticlePage } from './IframeArticlePage';
import IframeTopicPage from './IframeTopicPage';

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

const IframePageWrapper = ({
  locale: { abbreviation: locale, messages },
  children,
}) => (
  <ApolloProvider client={createApolloClient(locale)}>
    <IntlProvider locale={locale} messages={messages}>
      <MissingRouterContext.Provider value={true}>
        <PageContainer>
          <Helmet htmlAttributes={{ lang: locale }} />
          {children}
        </PageContainer>
      </MissingRouterContext.Provider>
    </IntlProvider>
  </ApolloProvider>
);

IframePageWrapper.propTypes = {
  locale: PropTypes.shape({
    abbreviation: PropTypes.string.isRequired,
    messages: PropTypes.object.isRequired,
  }).isRequired,
};

export const IframePage = ({
  status,
  locale,
  resource,
  location,
  article,
  isTopicArticle,
}) => {
  if (status !== 'success') {
    return (
      <IframePageWrapper locale={locale}>
        <Error />
      </IframePageWrapper>
    );
  }
  if (resource) {
    return (
      <IframePageWrapper locale={locale}>
        <IframeArticlePage
          locale={locale.abbreviation}
          resource={resource}
          location={location}
        />
      </IframePageWrapper>
    );
  }

  if (article && isTopicArticle) {
    return (
      <IframePageWrapper locale={locale}>
        <IframeTopicPage
          locale={locale.abbreviation}
          article={article}
          location={location}
        />
      </IframePageWrapper>
    );
  }
  return null;
};

IframePage.propTypes = {
  locale: PropTypes.shape({
    abbreviation: PropTypes.string.isRequired,
    messages: PropTypes.object.isRequired,
  }).isRequired,
  article: ArticleShape,
  resource: PropTypes.shape({
    article: ArticleShape,
    resourceTypes: PropTypes.arrayOf(ResourceTypeShape),
  }),
  status: PropTypes.oneOf(['success', 'error']),
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  isTopicArticle: PropTypes.bool,
};

IframePage.defaultProps = {
  isTopicArticle: false,
};
export default IframePage;
