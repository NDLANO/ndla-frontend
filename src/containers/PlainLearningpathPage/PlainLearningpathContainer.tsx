/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from '@apollo/client';
import { withTracker } from '@ndla/tracker';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { CustomWithTranslation, withTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { FeideUserApiType } from '@ndla/ui';
import SocialMediaMetadata from '../../components/SocialMediaMetadata';
import { GQLPlainLearningpathContainer_LearningpathFragment } from '../../graphqlTypes';
import { toLearningPath } from '../../routeHelpers';
import { htmlTitle } from '../../util/titleHelper';
import { getAllDimensions } from '../../util/trackingUtil';
import Learningpath from '../../components/Learningpath';
import ErrorPage from '../ErrorPage';

const getDocumentTitle = ({
  learningpath,
  t,
}: Pick<Props, 'learningpath' | 't'>) =>
  htmlTitle(learningpath.title, [t('htmlTitles.titleTemplate')]);

interface Props extends CustomWithTranslation {
  learningpath: GQLPlainLearningpathContainer_LearningpathFragment;
  stepId: string | undefined;
  skipToContentId?: string;
  user?: FeideUserApiType;
}
const PlainLearningpathContainer = ({
  t,
  learningpath,
  skipToContentId,
  stepId,
}: Props) => {
  const navigate = useNavigate();
  const steps = learningpath.learningsteps;

  useEffect(() => {
    if (window.MathJax && typeof window.MathJax.typeset === 'function') {
      try {
        window.MathJax.typeset();
      } catch (err) {
        // do nothing
      }
    }
  });

  const onKeyUpEvent = (evt: KeyboardEvent) => {
    const currentStep = stepId
      ? steps?.find(step => step.id.toString() === stepId)
      : steps?.[0];
    if (!currentStep) return;
    if (evt.code === 'ArrowRight' || evt.code === 'ArrowLeft') {
      const directionValue = evt.code === 'ArrowRight' ? 1 : -1;
      const newSeqNo = currentStep.seqNo + directionValue;
      const newLearningpathStep = learningpath.learningsteps?.find(
        step => step.seqNo === newSeqNo,
      );
      if (newLearningpathStep) {
        navigate(toLearningPath(learningpath.id, newLearningpathStep.id));
      }
    }
  };

  const currentStep = stepId
    ? steps.find(step => step.id.toString() === stepId)
    : steps[0];

  if (!currentStep) {
    return <ErrorPage />;
  }

  return (
    <div>
      <Helmet>
        <title>{`${getDocumentTitle({ t, learningpath })}`}</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <SocialMediaMetadata
        title={htmlTitle(learningpath.title, [t('htmlTitles.titleTemplate')])}
        trackableContent={learningpath}
        description={learningpath.description}
        imageUrl={learningpath.coverphoto?.url}
      />
      <Learningpath
        learningpath={learningpath}
        learningpathStep={currentStep}
        skipToContentId={skipToContentId}
        onKeyUpEvent={onKeyUpEvent}
        breadcrumbItems={[]}
      />
    </div>
  );
};

PlainLearningpathContainer.willTrackPageView = (
  trackPageView: (props: Props) => void,
  currentProps: Props,
) => {
  if (!currentProps.learningpath) return;
  trackPageView(currentProps);
};

PlainLearningpathContainer.getDimensions = (props: Props) => {
  const { learningpath, user, stepId } = props;
  const learningstep = stepId
    ? learningpath.learningsteps?.find(step => `${step.id}` === stepId)
    : learningpath.learningsteps?.[0];
  return getAllDimensions(
    { learningpath, user, learningstep },
    undefined,
    true,
  );
};

PlainLearningpathContainer.getDocumentTitle = getDocumentTitle;

export const plainLearningpathContainerFragments = {
  learningpath: gql`
    fragment PlainLearningpathContainer_Learningpath on Learningpath {
      supportedLanguages
      tags
      description
      coverphoto {
        url
      }
      learningsteps {
        ...Learningpath_LearningpathStep
      }
      ...Learningpath_Learningpath
    }
    ${Learningpath.fragments.learningpath}
    ${Learningpath.fragments.learningpathStep}
  `,
};

export default withTranslation()(withTracker(PlainLearningpathContainer));
