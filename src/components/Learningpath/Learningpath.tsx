/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from "@apollo/client";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { LearningpathContext } from "./learningpathUtils";
import {
  GQLLearningpath_LearningpathFragment,
  GQLLearningpath_LearningpathStepFragment,
  GQLLearningpathPage_NodeFragment,
} from "../../graphqlTypes";
import { Breadcrumb } from "../../interfaces";
import { toBreadcrumbItems } from "../../routeHelpers";
import { ContentPlaceholder } from "../ContentPlaceholder";
import { MobileLaunchpadMenu } from "../Resource/Launchpad";
import { ResourceBreadcrumb } from "../Resource/ResourceBreadcrumb";
import { LayoutWrapper, ResourceContent, ResourceContentContainer } from "../Resource/ResourceLayout";
import { RestrictedBlockContextProvider } from "../RestrictedBlock";
import { LearningpathIntroduction } from "./components/LearningpathIntroduction";
import { LearningpathNavigation } from "./components/LearningpathNavigation";
import { LearningpathStep } from "./components/LearningpathStep";
import { LastLearningpathStepInfo } from "./LastLearningpathStepInfo";
import { LearningpathMenu } from "./LearningpathMenu";

interface Props {
  learningpath: GQLLearningpath_LearningpathFragment | undefined;
  learningpathStep: GQLLearningpath_LearningpathStepFragment | undefined;
  resource?: GQLLearningpathPage_NodeFragment;
  skipToContentId?: string;
  resourcePath?: string;
  context?: LearningpathContext;
  loading: boolean;
}

export const Learningpath = ({
  learningpath,
  learningpathStep,
  resourcePath,
  resource,
  skipToContentId,
  loading,
  context = "default",
}: Props) => {
  const { t } = useTranslation();
  const index = learningpathStep
    ? learningpath?.learningsteps.findIndex((step) => step.id === learningpathStep.id)
    : undefined;

  const breadcrumbs: Breadcrumb[] = useMemo(() => {
    const crumbs: Breadcrumb[] = resource?.context?.parents?.slice() ?? [];
    if (resource?.url) {
      crumbs.push({ name: resource.name, url: resource.url });
    }

    return crumbs;
  }, [resource]);

  const ldCrumbs: Breadcrumb[] = useMemo(
    () => toBreadcrumbItems(t("breadcrumb.toFrontpage"), [...(resource?.context?.parents ?? []), resource]),
    [resource, t],
  );

  return (
    <>
      {!!breadcrumbs.length && <ResourceBreadcrumb breadcrumbs={breadcrumbs} loading={loading} />}
      <MobileLaunchpadMenu alwaysVisisble={context === "preview"}>
        <LearningpathMenu
          resourcePath={resourcePath}
          learningpath={learningpath}
          currentIndex={index}
          context={context}
          hasIntroduction={!!learningpath?.introduction?.length}
          displayContext="mobile"
          loading={loading}
        />
      </MobileLaunchpadMenu>
      <LayoutWrapper>
        {context === "default" && (
          <LearningpathMenu
            resourcePath={resourcePath}
            learningpath={learningpath}
            currentIndex={index}
            context={context}
            hasIntroduction={!!learningpath?.introduction?.length}
            displayContext="desktop"
            loading={loading}
          />
        )}
        <ResourceContentContainer>
          {!learningpathStep && !!learningpath?.introduction?.length && (
            <LearningpathIntroduction learningpath={learningpath} isInactive={!!resource?.context?.isArchived} />
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
          {!!learningpath &&
            learningpath.learningsteps.findIndex((step) => step.id === learningpathStep?.id) !==
              learningpath.learningsteps.length - 1 && (
              <LearningpathNavigation
                learningpath={learningpath}
                currentId={learningpathStep?.id}
                context={context}
                parentUrl={resource?.context?.parents?.[resource.context.parents.length - 1]?.url}
                resourcePath={resourcePath}
              />
            )}
        </ResourceContentContainer>
      </LayoutWrapper>
    </>
  );
};

Learningpath.fragments = {
  learningpathStep: gql`
    fragment Learningpath_LearningpathStep on BaseLearningpathStep {
      seqNo
      id
      showTitle
      title
      description
      copyright {
        license {
          license
        }
        contributors {
          type
          name
        }
      }
      ...LearningpathMenu_LearningpathStep
      ...LearningpathStep_LearningpathStep
    }
    ${LearningpathMenu.fragments.step}
    ${LearningpathStep.fragments.learningpathStep}
  `,
  learningpath: gql`
    fragment Learningpath_Learningpath on BaseLearningpath {
      ...LearningpathMenu_Learningpath
      ...LearningpathNavigation_Learningpath
    }
    ${LearningpathMenu.fragments.learningpath}
    ${LearningpathNavigation.fragments.learningpath}
  `,
};
