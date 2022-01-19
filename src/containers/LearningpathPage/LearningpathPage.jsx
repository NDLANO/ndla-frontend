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
import { withTranslation } from 'react-i18next';
import { getArticleProps } from '../../util/getArticleProps';
import { getAllDimensions } from '../../util/trackingUtil';
import { htmlTitle } from '../../util/titleHelper';
import SocialMediaMetadata from '../../components/SocialMediaMetadata';
import Learningpath from '../../components/Learningpath';
import DefaultErrorMessage from '../../components/DefaultErrorMessage';
import {
  GraphQLResourceShape,
  GraphQLResourceTypeShape,
  GraphQLTopicShape,
  GraphQLSubjectShape,
} from '../../graphqlShapes';
import { toBreadcrumbItems, toLearningPath } from '../../routeHelpers';
import { getSubjectLongName } from '../../data/subjects';
import { LocationShape } from '../../shapes';

class LearningpathPage extends Component {
  componentDidUpdate() {
    if (window.MathJax) {
      window.MathJax.typeset();
    }
  }

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
        relevance,
      },
      locale,
      match: {
        params: { stepId },
      },
      user,
    } = props;
    const firstStep = learningpath.learningsteps[0];
    const currentStep = learningpath.learningsteps.find(
      ls => `${ls.id}` === stepId,
    );
    const learningstep = currentStep || firstStep;
    const longName = getSubjectLongName(subject?.id, locale);

    return getAllDimensions(
      {
        subject,
        relevance,
        topicPath,
        learningpath,
        learningstep,
        filter: longName,
        user,
      },
      articleProps.label,
      false,
    );
  }

  static getTitle(subject, learningpath, learningpathStep) {
    return htmlTitle(learningpath?.title, [
      learningpathStep?.title,
      subject?.name,
    ]);
  }

  static getDocumentTitle({ t, data }) {
    const {
      subject,
      resource: { learningpath },
    } = data;
    return htmlTitle(this.getTitle(subject, learningpath), [
      t('htmlTitles.titleTemplate'),
    ]);
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
      t,
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

    const breadcrumbItems =
      subject && topicPath
        ? toBreadcrumbItems(
            t('breadcrumb.toFrontpage'),
            [subject, ...topicPath, { name: learningpath.title, url: '' }],
            locale,
          )
        : toBreadcrumbItems(
            t('breadcrumb.toFrontpage'),
            [{ name: learningpath.title, url: '' }],
            locale,
          );

    return (
      <div>
        <Helmet>
          <title>{`${this.constructor.getDocumentTitle(this.props)}`}</title>
        </Helmet>
        <SocialMediaMetadata
          title={htmlTitle(
            this.constructor.getTitle(subject, learningpath, learningpathStep),
            [t('htmlTitles.titleTemplate')],
          )}
          trackableContent={learningpath}
          description={learningpath.description}
          locale={locale}
          image={{
            url: learningpath?.coverphoto?.url,
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
          breadcrumbItems={breadcrumbItems}
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
  location: LocationShape,
  loading: PropTypes.bool.isRequired,
  ndlaFilm: PropTypes.bool.isRequired,
  data: PropTypes.shape({
    resource: GraphQLResourceShape,
    resourceTypes: PropTypes.arrayOf(GraphQLResourceTypeShape),
    topic: GraphQLTopicShape,
    topicPath: PropTypes.arrayOf(GraphQLTopicShape),
    relevance: PropTypes.string,
    subject: GraphQLSubjectShape,
  }),
  skipToContentId: PropTypes.string,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  user: PropTypes.shape({
    eduPersonPrimaryAffiliation: PropTypes.string,
    primarySchool: PropTypes.shape({
      displayName: PropTypes.string,
    }),
  }),
};

LearningpathPage.defaultProps = {
  status: 'initial',
};

export default withTranslation()(withTracker(LearningpathPage));
