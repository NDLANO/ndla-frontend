/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from "@apollo/client";
import { Hero, HeroBackground } from "@ndla/primitives";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { DefaultErrorMessagePage } from "../../components/DefaultErrorMessage";
import { LearningpathContent } from "../../components/Learningpath/LearningpathContent";
import { LearningpathMenu } from "../../components/Learningpath/LearningpathMenu";
import { PageTitle } from "../../components/PageTitle";
import { MobileLaunchpadMenu } from "../../components/Resource/Launchpad";
import { ResourceBreadcrumb } from "../../components/Resource/ResourceBreadcrumb";
import { LayoutWrapper, ResourceContentContainer, RootPageContent } from "../../components/Resource/ResourceLayout";
import { SocialMediaMetadata } from "../../components/SocialMediaMetadata";
import { GQLLearningpathPage_NodeFragment } from "../../graphqlTypes";
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

  const learningpath = node.learningpath;

  const learningpathStep = stepId
    ? learningpath?.learningsteps?.find((step) => step.id.toString() === stepId.toString())
    : learningpath?.introduction?.length
      ? undefined
      : learningpath?.learningsteps?.[0];

  const title = useMemo(() => {
    return htmlTitle(learningpath?.title, [learningpathStep?.title, node.context?.parents?.[0]?.name]);
  }, [learningpath?.title, learningpathStep?.title, node.context?.parents]);

  if (!learningpath || !learningpath.learningsteps?.length) {
    return <DefaultErrorMessagePage />;
  }

  const index = learningpathStep
    ? learningpath?.learningsteps.findIndex((step) => step.id === learningpathStep.id)
    : undefined;

  return (
    <>
      <PageTitle title={htmlTitle(title, [t("htmlTitles.titleTemplate")])} trackingProps={node.context} />
      {!!node.context?.isArchived && <meta name="robots" content="noindex, nofollow" />}
      <SocialMediaMetadata
        title={title}
        trackableContent={learningpath}
        description={learningpath.description}
        imageUrl={learningpath.coverphoto?.image.imageUrl}
        canonicalPath={node.context?.url}
      />
      <Hero variant="brand3Moderate">
        <HeroBackground />
        <RootPageContent variant="wide">
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
            <ResourceContentContainer asChild consumeCss>
              <main>
                <LearningpathContent
                  learningpath={learningpath}
                  learningpathStep={learningpathStep}
                  resource={node}
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

LearningpathPage.fragments = {
  resource: gql`
    fragment LearningpathPage_Node on Node {
      id
      nodeType
      name
      url
      context {
        contextId
        rootId
        isArchived
        url
        defaultUrl
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
