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
import { getArticleProps } from '../../util/getArticleProps';
import { getAllDimensions } from '../../util/trackingUtil';
import SocialMediaMetadata from '../../components/SocialMediaMetadata';
import Learningpath from '../../components/Learningpath';
import { DefaultErrorMessage } from '../../components/DefaultErrorMessage';
import {
  GraphQLResourceShape,
  GraphQLResourceTypeShape,
  GraphQLTopicShape,
  GraphQLSubjectShape,
} from '../../graphqlShapes';
import { toLearningPath } from '../../routeHelpers';

class LearningpathPage extends Component {
  static willTrackPageView(trackPageView, currentProps) {
    const { loading, data } = currentProps;
    if (loading || !data) {
      return;
    }
    trackPageView(currentProps);
  }

  static getDimensions(props) {
    const articleProps = getArticleProps(props.data.resource);
    const {
      data: {
        resource: { learningpath },
        subject,
        topicPath,
      },
      match: {
        params: { stepId },
      },
    } = props;
    const firstStep = learningpath.learningsteps[0];
    const currentStep = learningpath.learningsteps.find(
      ls => `${ls.id}` === stepId,
    );
    const learningstep = currentStep || firstStep;
    return getAllDimensions(
      { subject, topicPath, learningpath, learningstep },
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

  onKeyUpEvent = evt => {
    const {
      data: { resource },
      match: {
        params: { stepId },
      },
    } = this.props;
    const learningpathStep = stepId
      ? resource.learningpath.learningsteps.find(
          step => step.id.toString() === stepId.toString(),
        )
      : resource.learningpath.learningsteps[0];
    if (evt.code === 'ArrowRight' || evt.code === 'ArrowLeft') {
      const directionValue = evt.code === 'ArrowRight' ? 1 : -1;
      const newSeqNo = learningpathStep.seqNo + directionValue;
      const newLearningpathStep = resource.learningpath.learningsteps.find(
        step => step.seqNo === newSeqNo,
      );
      if (newLearningpathStep) {
        this.props.history.push(
          toLearningPath(
            resource.learningpath.id,
            newLearningpathStep.id,
            resource,
          ),
        );
      }
    }
  };

  render() {
    const {
      data,
      locale,
      skipToContentId,
      ndlaFilm,
      match: {
        params: { stepId },
      },
    } = this.props;

    if (
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
          onKeyUpEvent={this.onKeyUpEvent}
          resource={resource}
          resourceTypes={resourceTypes}
          topicPath={topicPath}
          locale={locale}
          ndlaFilm={ndlaFilm}
          {...getArticleProps()}
        />
      </div>
    );
  }
}

LearningpathPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      subjectId: PropTypes.string.isRequired,
      topicId: PropTypes.string.isRequired,
      resourceId: PropTypes.string.isRequired,
      stepId: PropTypes.string,
    }).isRequired,
  }).isRequired,
  status: PropTypes.string,
  locale: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  ndlaFilm: PropTypes.bool.isRequired,
  data: PropTypes.shape({
    resource: GraphQLResourceShape,
    resourceTypes: PropTypes.arrayOf(GraphQLResourceTypeShape),
    topic: GraphQLTopicShape,
    topicPath: PropTypes.arrayOf(GraphQLTopicShape),
    subject: GraphQLSubjectShape,
  }),
  skipToContentId: PropTypes.string,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

LearningpathPage.defaultProps = {
  status: 'initial',
};

export default injectT(withTracker(LearningpathPage));
