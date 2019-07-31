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
import { injectT } from '@ndla/i18n';
import { withTracker } from '@ndla/tracker';
import { LearningpathShape } from '../../shapes';
import { getAllDimensions } from '../../util/trackingUtil';
import LearningPath from '../../components/Learningpath';
import { runQueries } from '../../util/runQueries';
import { learningPathStepQuery } from '../../queries';
import { DefaultErrorMessage } from '../../components/DefaultErrorMessage';
import SocialMediaMetadata from '../../components/SocialMediaMetadata';

const getTitle = learningpath => (learningpath ? learningpath.title : '');

class PlainLearningPathPage extends Component {
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
    return getAllDimensions(props, undefined, true);
  }

  static getDocumentTitle({ t, data }) {
    const { learningpath } = data;
    return `${getTitle(learningpath)}${t('htmlTitles.titleTemplate')}`;
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

  render() {
    const {
      data,
      loading,
      locale,
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
      !data.learningpath ||
      !data.learningpath.learningsteps.length === 0
    ) {
      return <DefaultErrorMessage />;
    }
    const { learningpath } = data;
    const learningpathStep = stepId
      ? learningpath.learningsteps.find(
          step => step.id.toString() === stepId.toString(),
        )
      : learningpath.learningsteps[0];

    return (
      <div>
        <Helmet>
          <title>{`${this.constructor.getDocumentTitle(this.props)}`}</title>
        </Helmet>
        <SocialMediaMetadata
          title={`${learningpath.title} - ${learningpathStep.title}`}
          trackableContent={learningpath}
          description={learningpath.description}
          locale={locale}
          image={{
            src: learningpath.coverphoto ? learningpath.coverphoto.url : '',
          }}
        />
        <LearningPath
          id={skipToContentId}
          learningpath={learningpath}
          skipToContentId={skipToContentId}
          locale={locale}
          learningpathStep={learningpathStep}
        />
      </div>
    );
  }
}

PlainLearningPathPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      learningpathId: PropTypes.string.isRequired,
      stepId: PropTypes.string,
    }).isRequired,
  }).isRequired,
  data: PropTypes.shape({
    learningpath: LearningpathShape,
  }),
  loading: PropTypes.bool.isRequired,
  locale: PropTypes.string.isRequired,
  skipToContentId: PropTypes.string,
};

export default compose(
  injectT,
  withTracker,
)(PlainLearningPathPage);
