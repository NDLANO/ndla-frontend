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
import { getUrnIdsFromProps } from '../../routeHelpers';
import ArticleHero from '../ArticlePage/components/ArticleHero';
import ArticleErrorMessage from '../ArticlePage/components/ArticleErrorMessage';
import { getArticleScripts } from '../../util/getArticleScripts';
import getStructuredDataFromArticle from '../../util/getStructuredDataFromArticle';
import { getArticleProps } from '../../util/getArticleProps';
import { getAllDimensions } from '../../util/trackingUtil';
import SocialMediaMetadata from '../../components/SocialMediaMetadata';
import Learningpath from '../../components/Learningpath';
import { getTopicPath } from '../../util/getTopicPath';
import { runQueries } from '../../util/runQueries';
import {
  subjectTopicsQuery,
  resourceTypesQuery,
  topicResourcesQuery,
  resourceWithLearningpathQuery,
} from '../../queries';
import { DefaultErrorMessage } from '../../components/DefaultErrorMessage';
import {
  GraphQLResourceShape,
  GraphQLResourceTypeShape,
  GraphQLTopicShape,
  GraphQLSubjectShape,
} from '../../graphqlShapes';

const transformData = data => {
  const { subject, topic } = data;

  const topicPath =
    subject && topic ? getTopicPath(subject.id, topic.id, subject.topics) : [];
  return { ...data, topicPath };
};

class LearningPathPage extends Component {
  static willTrackPageView(trackPageView, currentProps) {
    const { loading, data } = currentProps;
    if (loading || !data) {
      return;
    }
    trackPageView(currentProps);
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
    const articleProps = getArticleProps(props.data.resource);
    const {
      data: { learningpath, learningpathStep, subject, topicPath },
    } = props;
    return getAllDimensions(
      { subject, topicPath, learningpath, learningpathStep },
      articleProps.label,
      false,
    );
  }

  static getDocumentTitle({ t, data }) {
    const {
      subject,
      resource: { learningpath },
    } = data;
    return `${subject ? subject.name : ''} - ${
      learningpath ? learningpath.title : ''
    }${t('htmlTitles.titleTemplate')}`;
  }

  static async getInitialProps(ctx) {
    const { client } = ctx;
    const { subjectId, resourceId, topicId } = getUrnIdsFromProps(ctx);
    const response = await runQueries(client, [
      {
        query: subjectTopicsQuery,
        variables: { subjectId },
      },
      {
        query: topicResourcesQuery,
        variables: { topicId, subjectId },
      },
      {
        query: resourceWithLearningpathQuery,
        variables: { resourceId, subjectId },
      },
      {
        query: resourceTypesQuery,
      },
    ]);
    return {
      ...response,
      data: transformData(response.data),
    };
  }

  render() {
    const {
      data,
      locale,
      loading,
      skipToContentId,
      match: {
        params: { stepId },
      },
    } = this.props;
    if (loading) {
      return null;
    }
    if (
      !data ||
      !data.resource ||
      !data.resource.learningpath ||
      !data.topic ||
      !data.topicPath ||
      !data.subject ||
      !data.resource.learningpath.learningsteps.length === 0
    ) {
      return <DefaultErrorMessage />;
    }
    const { resource, topic, resourceTypes, subject, topicPath } = data;
    const { learningpath } = resource;

    const learningpathStep = stepId
      ? learningpath.learningsteps.find(
          step => step.id.toString() === stepId.toString(),
        )
      : learningpath.learningsteps[0];

    if (!learningpathStep) {
      return null;
    }

    return (
      <div>
        <Helmet>
          <title>{`${this.constructor.getDocumentTitle(this.props)}`}</title>
        </Helmet>
        <SocialMediaMetadata
          title={`${subject && subject.name ? subject.name + ' - ' : ''}${
            learningpath.title
          } - ${learningpathStep.title}`}
          trackableContent={learningpath}
          description={learningpath.description}
          locale={locale}
          image={{
            src: learningpath.coverphoto ? learningpath.coverphoto.url : '',
          }}
        />
        <Learningpath
          skipToContentId={skipToContentId}
          learningpath={learningpath}
          learningpathStep={learningpathStep}
          topic={topic}
          subject={subject}
          resource={resource}
          resourceTypes={resourceTypes}
          topicPath={topicPath}
          locale={locale}
          {...getArticleProps()}
        />
      </div>
    );
  }
}

LearningPathPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      subjectId: PropTypes.string.isRequired,
      topicId: PropTypes.string.isRequired,
      resourceId: PropTypes.string.isRequired,
      stepId: PropTypes.string,
    }).isRequired,
  }).isRequired,
  learningPath: ArticleShape, // TODO: fix!,
  learningPathStep: PropTypes.object,
  status: PropTypes.string,
  locale: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  data: PropTypes.shape({
    resource: GraphQLResourceShape,
    resourceTypes: PropTypes.arrayOf(GraphQLResourceTypeShape),
    topic: GraphQLTopicShape,
    topicPath: PropTypes.arrayOf(GraphQLTopicShape),
    subject: GraphQLSubjectShape,
  }),
  skipToContentId: PropTypes.string,
};

LearningPathPage.defaultProps = {
  status: 'initial',
};

export default compose(
  injectT,
  withTracker,
)(LearningPathPage);
