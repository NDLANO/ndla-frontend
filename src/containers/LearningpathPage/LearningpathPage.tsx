/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from "@apollo/client";
import { Hero, HeroBackground } from "@ndla/primitives";
import { TFunction } from "i18next";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { DefaultErrorMessagePage } from "../../components/DefaultErrorMessage";
import { LearningpathContent } from "../../components/Learningpath/LearningpathContent";
import { LearningpathMenu } from "../../components/Learningpath/LearningpathMenu";
import { PageTitle } from "../../components/PageTitle";
import { MobileLaunchpadMenu } from "../../components/Resource/Launchpad";
import { ResourceBreadcrumb } from "../../components/Resource/ResourceBreadcrumb";
import { LayoutWrapper, RootPageContent } from "../../components/Resource/ResourceLayout";
import { SocialMediaMetadata } from "../../components/SocialMediaMetadata";
import {
  GQLLearningpath,
  GQLLearningpathPage_NodeFragment,
  GQLLearningpathStep,
  GQLTaxonomyCrumb,
} from "../../graphqlTypes";
import { Breadcrumb } from "../../interfaces";
import { htmlTitle } from "../../util/titleHelper";

interface Props {
  node: GQLLearningpathPage_NodeFragment;
  skipToContentId: string;
  stepId?: string;
  loading: boolean;
}

export const LearningpathPage = ({ node, skipToContentId, stepId, loading }: Props) => {
  const { t } = useTranslation();

  const breadcrumbs: Breadcrumb[] = useMemo(() => {
    const crumbs: Breadcrumb[] = node?.context?.parents?.slice() ?? [];
    if (node?.url) {
      crumbs.push({ name: node.name, url: node.url });
    }

    return crumbs;
  }, [node]);

  if (!node.learningpath || !node?.learningpath?.learningsteps?.length) {
    return <DefaultErrorMessagePage />;
  }
  const learningpath = node.learningpath;

  const learningpathStep = stepId
    ? learningpath.learningsteps?.find((step) => step.id.toString() === stepId.toString())
    : learningpath.introduction?.length
      ? undefined
      : learningpath.learningsteps?.[0];

  const index = learningpathStep
    ? learningpath?.learningsteps.findIndex((step) => step.id === learningpathStep.id)
    : undefined;

  return (
    <>
      <PageTitle title={getDocumentTitle(t, node, stepId)} />
      {!!node.context?.isArchived && <meta name="robots" content="noindex, nofollow" />}
      <SocialMediaMetadata
        title={getTitle(node.context?.parents?.[0], learningpath, learningpathStep)}
        trackableContent={learningpath}
        description={learningpath.description}
        imageUrl={learningpath.coverphoto?.image.imageUrl}
      />
      <Hero variant="brand3Moderate">
        <HeroBackground />
        <RootPageContent variant="wide" asChild consumeCss>
          <main>
            {!!breadcrumbs.length && <ResourceBreadcrumb breadcrumbs={breadcrumbs} loading={loading} />}
            <MobileLaunchpadMenu>
              <LearningpathMenu
                resourcePath={node.url}
                learningpath={learningpath}
                currentIndex={index}
                hasIntroduction={!!learningpath?.introduction?.length}
                displayContext="mobile"
                loading={loading}
              />
            </MobileLaunchpadMenu>
            <LayoutWrapper>
              <LearningpathMenu
                resourcePath={node.url}
                learningpath={learningpath}
                currentIndex={index}
                hasIntroduction={!!learningpath?.introduction?.length}
                displayContext="desktop"
                loading={loading}
              />
              <LearningpathContent
                learningpath={learningpath}
                learningpathStep={learningpathStep}
                resource={node}
                skipToContentId={skipToContentId}
                loading={loading}
              />
            </LayoutWrapper>
          </main>
        </RootPageContent>
      </Hero>
    </>
  );
};

const getTitle = (
  root?: Pick<GQLTaxonomyCrumb, "name">,
  learningpath?: Pick<GQLLearningpath, "title">,
  learningpathStep?: Pick<GQLLearningpathStep, "title">,
) => {
  return htmlTitle(learningpath?.title, [learningpathStep?.title, root?.name]);
};

const getDocumentTitle = (t: TFunction, node: NonNullable<GQLLearningpathPage_NodeFragment>, stepId?: string) => {
  const subject = node.context?.parents?.[0];
  const learningpath = node?.learningpath;
  const maybeStepId = parseInt(stepId ?? "");
  const step = learningpath?.learningsteps.find((step) => step.id === maybeStepId);
  return htmlTitle(getTitle(subject, learningpath, step), [t("htmlTitles.titleTemplate")]);
};

LearningpathPage.fragments = {
  resource: gql`
    fragment LearningpathPage_Node on Node {
      id
      nodeType
      name
      url
      context {
        contextId
        isArchived
        parents {
          contextId
          id
          name
          url
        }
      }
      learningpath {
        id
        supportedLanguages
        tags
        description
        coverphoto {
          id
          image {
            imageUrl
          }
          metaUrl
        }
        learningsteps {
          type
          ...LearningpathContent_LearningpathStep
        }
        ...LearningpathContent_Learningpath
        ...LearningpathMenu_Learningpath
      }
      ...LearningpathContent_Node
    }
    ${LearningpathMenu.fragments.learningpath}
    ${LearningpathContent.fragments.learningpath}
    ${LearningpathContent.fragments.learningpathStep}
    ${LearningpathContent.fragments.node}
  `,
};
