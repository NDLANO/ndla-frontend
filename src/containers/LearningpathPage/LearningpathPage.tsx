/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { TFunction } from "i18next";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { gql } from "@apollo/client";
import { DefaultErrorMessagePage } from "../../components/DefaultErrorMessage";
import { PageLayout } from "../../components/Layout/PageContainer";
import { Learningpath } from "../../components/Learningpath/Learningpath";
import { PageTitle } from "../../components/PageTitle";
import { SocialMediaMetadata } from "../../components/SocialMediaMetadata";
import {
  GQLLearningpath,
  GQLLearningpathPage_NodeFragment,
  GQLLearningpathStep,
  GQLTaxonomyCrumb,
} from "../../graphqlTypes";
import { toBreadcrumbItems } from "../../routeHelpers";
import { htmlTitle } from "../../util/titleHelper";

interface Props {
  node: GQLLearningpathPage_NodeFragment | undefined;
  skipToContentId: string;
  stepId?: string;
}

export const LearningpathPage = ({ node, skipToContentId, stepId }: Props) => {
  const { t } = useTranslation();
  useEffect(() => {
    if (window.MathJax && typeof window.MathJax.typesetPromise === "function") {
      try {
        window.MathJax.typesetPromise();
      } catch (err) {
        // do nothing
      }
    }
  });

  if (!node || !node.learningpath || !node?.learningpath?.learningsteps?.length) {
    return <DefaultErrorMessagePage />;
  }
  const crumbs = node.context?.parents ?? [];
  const root = crumbs[0];
  const learningpath = node.learningpath!;

  const learningpathStep = stepId
    ? learningpath.learningsteps?.find((step) => step.id.toString() === stepId.toString())
    : learningpath.introduction?.length
      ? undefined
      : learningpath.learningsteps?.[0];

  const breadcrumbItems = toBreadcrumbItems(t("breadcrumb.toFrontpage"), [...crumbs, node]);

  return (
    <>
      <PageTitle title={getDocumentTitle(t, node, stepId)} />
      {!!node.context?.isArchived && <meta name="robots" content="noindex, nofollow" />}
      <SocialMediaMetadata
        title={getTitle(root, learningpath, learningpathStep)}
        trackableContent={learningpath}
        description={learningpath.description}
        imageUrl={learningpath.coverphoto?.url}
      />
      <PageLayout asChild consumeCss>
        <main>
          <Learningpath
            skipToContentId={skipToContentId}
            learningpath={learningpath}
            learningpathStep={learningpathStep}
            resource={node}
            resourcePath={node.url}
            breadcrumbItems={breadcrumbItems}
          />
        </main>
      </PageLayout>
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
          url
          metaUrl
        }
        learningsteps {
          type
          ...Learningpath_LearningpathStep
        }
        ...Learningpath_Learningpath
      }
    }
    ${Learningpath.fragments.learningpathStep}
    ${Learningpath.fragments.learningpath}
  `,
};
