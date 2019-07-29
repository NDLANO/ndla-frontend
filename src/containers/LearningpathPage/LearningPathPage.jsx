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
import { getArticleScripts } from '../../util/getArticleScripts';
import getStructuredDataFromArticle from '../../util/getStructuredDataFromArticle';
import { getArticleProps } from '../../util/getArticleProps';
import { getAllDimensions } from '../../util/trackingUtil';
import SocialMediaMetadata from '../../components/SocialMediaMetadata';
import { fetchLearningPath, fetchLearningPathStep } from './learningpathApi';
import LearningPath from '../../components/Learningpath';
import { fetchArticle } from '../ArticlePage/articleApi';
import { getTopicPath } from '../../util/getTopicPath';
import { runQueries } from '../../util/runQueries';
import { getFiltersFromUrl } from '../../util/filterHelper';
import { learningPathStepQuery } from '../../queries';

const getTitle = article => (article ? article.title : '');

const getArticleIdFromEmbedUrl = embedUrl => {
  const splittedUrl = embedUrl ? embedUrl.url.split('/') : undefined;
  if (!splittedUrl) {
    return undefined;
  }
  const lastUrlPart = splittedUrl[splittedUrl.length - 1];
  return lastUrlPart.includes(':') ? lastUrlPart.split(':').pop() : lastUrlPart;
};

class LearningPathPage extends Component {
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
      client,
      match: {
        params: { learningpathId },
      },
    } = ctx;
    const response = await runQueries(client, [
      {
        query: learningPathStepQuery,
        variables: { pathId: learningpathId },
      },
    ]);
    return response;
  }
  static async getInitialProps2(ctx) {
    const {
      match: { params },
      locale,
    } = ctx;
    const { learningpathId, stepId } = params;
    try {
      console.log(params);
      const learningPath = await fetchLearningPath(learningpathId, locale);
      const learningPathStepId = stepId || learningPath.learningsteps[0].id;
      const learningPathStep = await fetchLearningPathStep(
        learningpathId,
        learningPathStepId,
        locale,
      );

      const articleId = getArticleIdFromEmbedUrl(learningPathStep.embedUrl);
      const article = fetchArticle(articleId, locale);
      console.log(article);
      return { learningPath, learningPathStep, status: 'success' };
    } catch (error) {
      const status =
        error.json && error.json.status === 404 ? 'error404' : 'error';
      console.log(error);
      return { status };
    }
  }

  render() {
    const {
      data,
      status,
      locale,
      skipToContentId,
      match: {
        params: { stepId },
      },
    } = this.props;
    console.log(data);
    if (!data || !data.learningpath) {
      return null;
    }
    const { learningpath } = data;
    const learningpathStep = learningpath.learningsteps.find(
      step => step.id.toString() === stepId.toString(),
    );
    console.log('GGF', learningpath, learningpathStep);
    return (
      <div>
        <Helmet>
          <title>{`${this.constructor.getDocumentTitle(this.props)}`}</title>
        </Helmet>
        <OneColumn>
          <LearningPath
            id={skipToContentId}
            learningpath={learningpath}
            learningpathStep={learningpathStep}
            locale={locale}
            {...getArticleProps()}
          />
        </OneColumn>
      </div>
    );
  }
}

LearningPathPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      learningpathId: PropTypes.string.isRequired,
      stepId: PropTypes.string,
    }).isRequired,
  }).isRequired,
  learningPath: ArticleShape, // TODO: fix!,
  learningPathStep: PropTypes.object,
  status: PropTypes.string,
  locale: PropTypes.string.isRequired,
  skipToContentId: PropTypes.string,
};

LearningPathPage.defaultProps = {
  status: 'initial',
};

export default compose(
  injectT,
  withTracker,
)(LearningPathPage);
