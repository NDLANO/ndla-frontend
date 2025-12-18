/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { TFunction } from "i18next";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { gql } from "@apollo/client";
import { PageLayout } from "../../components/Layout/PageContainer";
import { Learningpath } from "../../components/Learningpath/Learningpath";
import { PageTitle } from "../../components/PageTitle";
import { SocialMediaMetadata } from "../../components/SocialMediaMetadata";
import { GQLPlainLearningpathContainer_LearningpathFragment } from "../../graphqlTypes";
import { htmlTitle } from "../../util/titleHelper";

const getDocumentTitle = (learningpath: Props["learningpath"], t: TFunction) =>
  htmlTitle(learningpath.title, [t("htmlTitles.titleTemplate")]);

interface Props {
  learningpath: GQLPlainLearningpathContainer_LearningpathFragment;
  stepId: string | undefined;
  skipToContentId?: string;
}
export const PlainLearningpathContainer = ({ learningpath, skipToContentId, stepId }: Props) => {
  const { t } = useTranslation();
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

  const currentStep = stepId
    ? steps.find((step) => step.id.toString() === stepId)
    : learningpath.introduction?.length
      ? undefined
      : steps[0];

  return (
    <>
      <PageTitle title={getDocumentTitle(learningpath, t)} />
      <meta name="robots" content="noindex, nofollow" />
      <SocialMediaMetadata
        title={learningpath.title}
        trackableContent={learningpath}
        description={learningpath.description}
        imageUrl={learningpath.coverphoto?.image.imageUrl}
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
        image {
          imageUrl
        }
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
