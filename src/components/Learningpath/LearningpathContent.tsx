/**
 * Copyright (c) 2026-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from "@apollo/client";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  GQLLearningpathContent_LearningpathFragment,
  GQLLearningpathContent_LearningpathStepFragment,
  GQLLearningpathContent_NodeFragment,
} from "../../graphqlTypes";
import { Breadcrumb } from "../../interfaces";
import { toBreadcrumbItems } from "../../routeHelpers";
import { ContentPlaceholder } from "../ContentPlaceholder";
import { ResourceContent, ResourceContentContainer } from "../Resource/ResourceLayout";
import { RestrictedBlockContextProvider } from "../RestrictedBlock";
import { LearningpathIntroduction } from "./components/LearningpathIntroduction";
import { LearningpathNavigation } from "./components/LearningpathNavigation";
import { LearningpathStep } from "./components/LearningpathStep";
import { LastLearningpathStepInfo } from "./LastLearningpathStepInfo";
import { LearningpathContext } from "./learningpathUtils";

interface Props {
  learningpath: GQLLearningpathContent_LearningpathFragment | undefined;
  learningpathStep: GQLLearningpathContent_LearningpathStepFragment | undefined;
  resource?: GQLLearningpathContent_NodeFragment | undefined;
  skipToContentId?: string;
  context?: LearningpathContext;
  loading: boolean;
}

export const LearningpathContent = ({
  learningpath,
  learningpathStep,
  resource,
  skipToContentId,
  loading,
  context = "default",
}: Props) => {
  const { t } = useTranslation();
  const ldCrumbs: Breadcrumb[] = useMemo(
    () => toBreadcrumbItems(t("breadcrumb.toFrontpage"), [...(resource?.context?.parents ?? []), resource]),
    [resource, t],
  );

  return (
    <ResourceContentContainer>
      {!learningpathStep && !!learningpath?.introduction?.length && (
        <LearningpathIntroduction
          introduction={learningpath.introduction}
          isInactive={!!resource?.context?.isArchived}
        />
      )}
      {!!loading && (
        <ResourceContent>
          <ContentPlaceholder variant="article" />
        </ResourceContent>
      )}
      {!!learningpathStep && !!learningpath && (
        <RestrictedBlockContextProvider value="learningpath">
          <LearningpathStep
            ldCrumbs={ldCrumbs}
            subjectId={resource?.context?.parents?.[0]?.id}
            learningpath={learningpath}
            skipToContentId={skipToContentId}
            learningpathStep={learningpathStep}
            isInactive={!!resource?.context?.isArchived}
          />
          <LastLearningpathStepInfo
            seqNo={learningpath.learningsteps.findIndex((step) => step.id === learningpathStep.id)}
            numberOfLearningSteps={learningpath.learningsteps.length - 1}
            title={learningpath.title}
            resource={resource}
          />
        </RestrictedBlockContextProvider>
      )}
      {/* Show navigation if you are on a plain learningpath page, or if you are not on the last learning step of a learningpath resource */}
      {!!learningpath &&
        (!resource?.url ||
          learningpath.learningsteps.findIndex((step) => step.id === learningpathStep?.id) !==
            learningpath.learningsteps.length - 1) && (
          <LearningpathNavigation
            learningpath={learningpath}
            currentId={learningpathStep?.id}
            context={context}
            parentUrl={resource?.context?.parents?.[resource.context.parents.length - 1]?.url}
            resourcePath={resource?.url}
          />
        )}
    </ResourceContentContainer>
  );
};

LearningpathContent.fragments = {
  learningpathStep: gql`
    fragment LearningpathContent_LearningpathStep on BaseLearningpathStep {
      id
      title
      introduction
      ...LearningpathStep_LearningpathStep
    }
    ${LearningpathStep.fragments.learningpathStep}
  `,
  learningpath: gql`
    fragment LearningpathContent_Learningpath on BaseLearningpath {
      id
      title
      ...LearningpathNavigation_Learningpath
      ...LearningpathStep_Learningpath
    }
    ${LearningpathStep.fragments.learningpath}
    ${LearningpathNavigation.fragments.learningpath}
  `,
  node: gql`
    fragment LearningpathContent_Node on Node {
      id
      url
      name
      context {
        contextId
        isArchived
        parents {
          id
          contextId
          url
          name
        }
      }
      ...LastLearningpathStepInfo_Node
    }
    ${LastLearningpathStepInfo.fragments.node}
  `,
};
