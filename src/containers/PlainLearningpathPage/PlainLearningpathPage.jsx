/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { withTracker } from '@ndla/tracker';

import { withTranslation } from 'react-i18next';
import { getAllDimensions } from '../../util/trackingUtil';
import Learningpath from '../../components/Learningpath';
import { learningPathStepQuery } from '../../queries';
import DefaultErrorMessage from '../../components/DefaultErrorMessage';
import SocialMediaMetadata from '../../components/SocialMediaMetadata';
import { useGraphQuery } from '../../util/runQueries';
import { htmlTitle } from '../../util/titleHelper';
import { toLearningPath } from '../../routeHelpers';

const getTitle = learningpath => (learningpath ? learningpath.title : '');

const getDocumentTitle = ({ t, data }) => {
  const { learningpath } = data;
  return `${htmlTitle(getTitle(learningpath), [
    t('htmlTitles.titleTemplate'),
  ])}`;
};

const PlainLearningpathPage = props => {
  useEffect(() => {
    if (window.MathJax) {
      window.MathJax.typeset();
    }
  });
  const {
    t,
    locale,
    skipToContentId,
    match: {
      params: { stepId, learningpathId },
    },
  } = props;

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

  const onKeyUpEvent = evt => {
    const {
      match: {
        params: { stepId },
      },
    } = props;
    const learningpathStep = stepId
      ? learningpath.learningsteps.find(
          step => step.id.toString() === stepId.toString(),
        )
      : learningpath.learningsteps[0];
    if (evt.code === 'ArrowRight' || evt.code === 'ArrowLeft') {
      const directionValue = evt.code === 'ArrowRight' ? 1 : -1;
      const newSeqNo = learningpathStep.seqNo + directionValue;
      const newLearningpathStep = learningpath.learningsteps.find(
        step => step.seqNo === newSeqNo,
      );
      if (newLearningpathStep) {
        props.history.push(
          toLearningPath(learningpath.id, newLearningpathStep.id, undefined),
        );
      }
    }
  };

  const { learningpath } = data;
  const learningpathStep = stepId
    ? learningpath.learningsteps.find(
        step => step.id.toString() === stepId.toString(),
      )
    : learningpath.learningsteps[0];

  return (
    <div>
      <Helmet>
        <title>{`${getDocumentTitle({ t, data })}`}</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <SocialMediaMetadata
        title={htmlTitle(getTitle(learningpath), [
          t('htmlTitles.titleTemplate'),
        ])}
        trackableContent={learningpath}
        description={learningpath.description}
        locale={locale}
        image={{
          url: learningpath?.coverphoto?.url,
        }}
      />
      <Learningpath
        learningpath={learningpath}
        learningpathStep={learningpathStep}
        skipToContentId={skipToContentId}
        onKeyUpEvent={onKeyUpEvent}
        locale={locale}
        ndlaFilm={false}
        breadcrumbItems={[]}
      />
    </div>
  );
};

PlainLearningpathPage.willTrackPageView = (trackPageView, currentProps) => {
  const { loading, data } = currentProps;
  if (loading || !data) {
    return;
  }
  trackPageView(currentProps);
};

PlainLearningpathPage.getDimensions = props => {
  return getAllDimensions(props, undefined, true);
};

PlainLearningpathPage.getDocumentTitle = getDocumentTitle;

PlainLearningpathPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      learningpathId: PropTypes.string.isRequired,
      stepId: PropTypes.string,
    }).isRequired,
  }).isRequired,
  locale: PropTypes.string.isRequired,
  skipToContentId: PropTypes.string,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default withTranslation()(withTracker(PlainLearningpathPage));
