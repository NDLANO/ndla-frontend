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
import { Learningpath } from "../../components/Learningpath/Learningpath";
import { PageTitle } from "../../components/PageTitle";
import { RootPageContent } from "../../components/Resource/ResourceLayout";
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

  return (
    <>
      <meta name="robots" content="noindex, nofollow" />
      {!!learningpath && (
        <>
          <PageTitle title={getDocumentTitle(learningpath, t)} />
          <SocialMediaMetadata
            title={learningpath.title}
            trackableContent={learningpath}
            description={learningpath.description}
            imageUrl={learningpath.coverphoto?.image.imageUrl}
          />
        </>
      )}
      <Hero variant="brand3Moderate">
        <HeroBackground />
        <RootPageContent variant="wide" asChild consumeCss>
          <main>
            <Learningpath
              learningpath={learningpath}
              learningpathStep={currentStep}
              skipToContentId={skipToContentId}
              loading={loading}
            />
          </main>
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
        ...Learningpath_LearningpathStep
      }
      ...Learningpath_Learningpath
    }
    ${Learningpath.fragments.learningpath}
    ${Learningpath.fragments.learningpathStep}
  `,
};
