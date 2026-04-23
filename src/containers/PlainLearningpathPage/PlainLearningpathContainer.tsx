/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from "@apollo/client";
import { Hero, HeroBackground } from "@ndla/primitives";
import { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { LearningpathContent } from "../../components/Learningpath/LearningpathContent";
import { LearningpathMenu } from "../../components/Learningpath/LearningpathMenu";
import { PageTitle } from "../../components/PageTitle";
import { MobileLaunchpadMenu } from "../../components/Resource/Launchpad";
import { LayoutWrapper, ResourceContentContainer, RootPageContent } from "../../components/Resource/ResourceLayout";
import { SocialMediaMetadata } from "../../components/SocialMediaMetadata";
import { GQLPlainLearningpathContainer_LearningpathFragment } from "../../graphqlTypes";
import { htmlTitle } from "../../util/titleHelper";

const getDocumentTitle = (learningpath: GQLPlainLearningpathContainer_LearningpathFragment, t: TFunction) =>
  htmlTitle(learningpath.title, [t("htmlTitles.titleTemplate")]);

interface Props {
  learningpath: GQLPlainLearningpathContainer_LearningpathFragment | undefined;
  stepId: string | undefined;
  skipToContentId?: string;
  loading: boolean;
}
export const PlainLearningpathContainer = ({ learningpath, skipToContentId, stepId, loading }: Props) => {
  const { t } = useTranslation();
  const steps = learningpath?.learningsteps;

  const currentStep = stepId
    ? steps?.find((step) => step.id.toString() === stepId)
    : learningpath?.introduction?.length
      ? undefined
      : steps?.[0];

  const index = currentStep ? learningpath?.learningsteps.findIndex((step) => step.id === currentStep.id) : undefined;

  return (
    <>
      <meta name="robots" content="noindex, nofollow" />
      {!!learningpath && (
        <>
          <PageTitle title={getDocumentTitle(learningpath, t)} useLocationForCustomPath={true} />
          <SocialMediaMetadata
            title={learningpath.title}
            trackableContent={learningpath}
            description={learningpath.description}
            imageUrl={learningpath.coverphoto?.image.imageUrl}
            useLocationForCanonicalPath={true}
          />
        </>
      )}
      <Hero variant="brand3Moderate">
        <HeroBackground />
        <RootPageContent variant="wide">
          <MobileLaunchpadMenu>
            <LearningpathMenu
              learningpath={learningpath}
              currentIndex={index}
              hasIntroduction={!!learningpath?.introduction?.length}
              displayContext="mobile"
              loading={loading}
            />
          </MobileLaunchpadMenu>
          <LayoutWrapper>
            <LearningpathMenu
              learningpath={learningpath}
              currentIndex={index}
              hasIntroduction={!!learningpath?.introduction?.length}
              displayContext="desktop"
              loading={loading}
            />
            <ResourceContentContainer asChild consumeCss>
              <main>
                <LearningpathContent
                  learningpath={learningpath}
                  learningpathStep={currentStep}
                  skipToContentId={skipToContentId}
                  loading={loading}
                />
              </main>
            </ResourceContentContainer>
          </LayoutWrapper>
        </RootPageContent>
      </Hero>
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
        ...LearningpathContent_LearningpathStep
      }
      ...LearningpathMenu_Learningpath
      ...LearningpathContent_Learningpath
    }
    ${LearningpathMenu.fragments.learningpath}
    ${LearningpathContent.fragments.learningpath}
    ${LearningpathContent.fragments.learningpathStep}
  `,
};
