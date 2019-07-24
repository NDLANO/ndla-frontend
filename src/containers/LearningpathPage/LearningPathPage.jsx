/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import Helmet from 'react-helmet';
import { OneColumn } from '@ndla/ui';
import { injectT } from '@ndla/i18n';
import { withTracker } from '@ndla/tracker';
import { ArticleShape } from '../../shapes';
import ArticleHero from '../ArticlePage/components/ArticleHero';
import ArticleErrorMessage from '../ArticlePage/components/ArticleErrorMessage';
import { fetchArticle } from '../ArticlePage/articleApi';
import { getArticleScripts } from '../../util/getArticleScripts';
import getStructuredDataFromArticle from '../../util/getStructuredDataFromArticle';
import { getArticleProps } from '../../util/getArticleProps';
import { getAllDimensions } from '../../util/trackingUtil';
import SocialMediaMetadata from '../../components/SocialMediaMetadata';
import { fetchLearningpath } from './learningpathApi';
import { LearningPath } from '../../components/Learningpath';

const getTitle = article => (article ? article.title : '');

class PlainArticlePage extends Component {
  static willTrackPageView(trackPageView, currentProps) {
    /*const { article } = currentProps;
    if (article && article.id) {
      trackPageView(currentProps);
    }*/
  }

  componentDidMount() {
    if (window.MathJax) {
      window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub]);
    }
  }

  componentDidUpdate() {
    if (window.MathJax) {
      window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub]);
    }
  }

  static getDimensions(props) {
    return getAllDimensions(props, undefined, true);
  }

  static getDocumentTitle({ t, article }) {
    return `${getTitle(article)}${t('htmlTitles.titleTemplate')}`;
  }

  static async getInitialProps(ctx) {
    const {
      match: { params },
      locale,
    } = ctx;
    const { learningpathId } = params;

    try {
      const learningpath = await fetchLearningpath(learningpathId, locale);
      return { learningpath, status: 'success' };
    } catch (error) {
      const status =
        error.json && error.json.status === 404 ? 'error404' : 'error';
      return { status };
    }
  }

  render() {
    const { learningpath, status, locale, skipToContentId } = this.props;

    if (status === 'error' || status === 'error404') {
      return (
        <div>
          <ArticleHero resource={{}} />
          <ArticleErrorMessage status={status} />
        </div>
      );
    }

    return (
      <div>
        <Helmet>
          <title>{`${this.constructor.getDocumentTitle(this.props)}`}</title>
        </Helmet>
        <OneColumn>
          <LearningPath
            id={skipToContentId}
            learningpath={learningpath}
            locale={locale}
            {...getArticleProps()}
          />
        </OneColumn>
      </div>
    );
  }
}

PlainArticlePage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      articleId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  learningpath: ArticleShape,
  status: PropTypes.string,
  locale: PropTypes.string.isRequired,
  skipToContentId: PropTypes.string,
};

PlainArticlePage.defaultProps = {
  status: 'initial',
};

export default compose(
  injectT,
  withTracker,
)(PlainArticlePage);
