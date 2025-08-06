/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { TFunction } from "i18next";
import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { gql } from "@apollo/client";
import { useTracker } from "@ndla/tracker";
import { AuthContext } from "../../components/AuthenticationContext";
import { DefaultErrorMessagePage } from "../../components/DefaultErrorMessage";
import { PageLayout } from "../../components/Layout/PageContainer";
import Learningpath from "../../components/Learningpath";
import SocialMediaMetadata from "../../components/SocialMediaMetadata";
import { GQLPlainLearningpathContainer_LearningpathFragment } from "../../graphqlTypes";
import { htmlTitle } from "../../util/titleHelper";
import { getAllDimensions } from "../../util/trackingUtil";

const getDocumentTitle = (learningpath: Props["learningpath"], t: TFunction) =>
  htmlTitle(learningpath.title, [t("htmlTitles.titleTemplate")]);

interface Props {
  learningpath: GQLPlainLearningpathContainer_LearningpathFragment;
  stepId: string | undefined;
  skipToContentId?: string;
}
const PlainLearningpathContainer = ({ learningpath, skipToContentId, stepId }: Props) => {
  const { user, authContextLoaded } = useContext(AuthContext);
  const { t } = useTranslation();
  const { trackPageView } = useTracker();
  const steps = learningpath.learningsteps;

  useEffect(() => {
    if (window.MathJax && typeof window.MathJax.typesetPromise === "function") {
      try {
        window.MathJax.typesetPromise();
      } catch (err) {
        // do nothing
      }
    }
  });

  useEffect(() => {
    if (learningpath && authContextLoaded) {
      const dimensions = getAllDimensions({ user });
      trackPageView({ dimensions, title: getDocumentTitle(learningpath, t) });
    }
  }, [authContextLoaded, learningpath, stepId, t, trackPageView, user]);

  const currentStep = stepId ? steps.find((step) => step.id.toString() === stepId) : steps[0];

  if (!currentStep) {
    return <DefaultErrorMessagePage />;
  }

  return (
    <>
      <title>{`${getDocumentTitle(learningpath, t)}`}</title>
      <meta name="robots" content="noindex, nofollow" />
      <SocialMediaMetadata
        title={learningpath.title}
        trackableContent={learningpath}
        description={learningpath.description}
        imageUrl={learningpath.coverphoto?.url}
      />
      <PageLayout asChild consumeCss>
        <main>
          <Learningpath
            learningpath={learningpath}
            learningpathStep={currentStep}
            skipToContentId={skipToContentId}
            breadcrumbItems={[]}
          />
        </main>
      </PageLayout>
    </>
  );
};

export const plainLearningpathContainerFragments = {
  learningpath: gql`
    fragment PlainLearningpathContainer_Learningpath on Learningpath {
      id
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

export default PlainLearningpathContainer;
