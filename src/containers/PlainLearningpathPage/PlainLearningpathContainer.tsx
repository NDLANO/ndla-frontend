/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { withTracker } from '@ndla/tracker';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { CustomWithTranslation, withTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import SocialMediaMetadata from '../../components/SocialMediaMetadata';
import { GQLLearningpathInfoFragment } from '../../graphqlTypes';
import { LocaleType } from '../../interfaces';
import { toLearningPath } from '../../routeHelpers';
import { htmlTitle } from '../../util/titleHelper';
import { getAllDimensions } from '../../util/trackingUtil';
import Learningpath from '../../components/Learningpath';
import { FeideUserWithGroups } from '../../util/feideApi';
import ErrorPage from '../ErrorPage';

const getDocumentTitle = ({
  learningpath,
  t,
}: Pick<Props, 'learningpath' | 't'>) =>
  htmlTitle(learningpath.title, [t('htmlTitles.titleTemplate')]);

interface Props extends CustomWithTranslation {
  learningpath: GQLLearningpathInfoFragment;
  locale: LocaleType;
  stepId: string | undefined;
  skipToContentId?: string;
  user?: FeideUserWithGroups;
}
const PlainLearningpathContainer = ({
  t,
  learningpath,
  locale,
  skipToContentId,
  stepId,
}: Props) => {
  const history = useHistory();
  const steps = learningpath.learningsteps;

  useEffect(() => {
    if (window.MathJax) {
      window.MathJax.typeset();
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
        history.push(toLearningPath(learningpath.id, newLearningpathStep.id));
      }
    }
  };

  const currentStep = stepId
    ? steps.find(step => step.id.toString() === stepId)
    : steps[0];

  if (!currentStep) {
    return <ErrorPage locale={locale} />;
  }

  const imageUrlObj = learningpath.coverphoto?.url
    ? { url: learningpath.coverphoto.url }
    : undefined;
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
        image={imageUrlObj}
      />
      <Learningpath
        learningpath={learningpath}
        learningpathStep={currentStep}
        skipToContentId={skipToContentId}
        onKeyUpEvent={onKeyUpEvent}
        locale={locale}
        ndlaFilm={false}
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

export default withTranslation()(withTracker(PlainLearningpathContainer));
