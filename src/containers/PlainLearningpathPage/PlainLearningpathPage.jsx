/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { injectT } from '@ndla/i18n';
import { withTracker } from '@ndla/tracker';

import { getAllDimensions } from '../../util/trackingUtil';
import LearningPath from '../../components/Learningpath';
import { learningPathStepQuery } from '../../queries';
import { DefaultErrorMessage } from '../../components/DefaultErrorMessage';
import SocialMediaMetadata from '../../components/SocialMediaMetadata';
import { useGraphQuery } from '../../util/runQueries';

const getTitle = learningpath => (learningpath ? learningpath.title : '');

const getDocumentTitle = ({ t, data }) => {
  const { learningpath } = data;
  return `${getTitle(learningpath)}${t('htmlTitles.titleTemplate')}`;
};

const PlainLearningPathPage = ({
  locale,
  skipToContentId,
  match: {
    params: { stepId, learningpathId },
  },
}) => {
  useEffect(() => {
    if (window.MathJax) {
      window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub]);
    }
  });

  const { data, loading } = useGraphQuery(learningPathStepQuery, {
    variables: { pathId: learningpathId },
  });

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
        <title>{`${getDocumentTitle(this.props)}`}</title>
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
};

PlainLearningPathPage.willTrackPageView = (trackPageView, currentProps) => {
  const { loading, data } = currentProps;
  if (loading || !data) {
    return;
  }
  trackPageView(currentProps);
};

PlainLearningPathPage.getDimensions = props => {
  return getAllDimensions(props, undefined, true);
};

PlainLearningPathPage.getDocumentTitle = getDocumentTitle;

PlainLearningPathPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      learningpathId: PropTypes.string.isRequired,
      stepId: PropTypes.string,
    }).isRequired,
  }).isRequired,
  locale: PropTypes.string.isRequired,
  skipToContentId: PropTypes.string,
};

export default injectT(withTracker(PlainLearningPathPage));
