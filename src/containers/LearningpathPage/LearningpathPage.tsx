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
import { useTranslation } from "react-i18next";
import { DefaultErrorMessagePage } from "../../components/DefaultErrorMessage";
import { Learningpath } from "../../components/Learningpath/Learningpath";
import { PageTitle } from "../../components/PageTitle";
import { RootPageContent } from "../../components/Resource/ResourceLayout";
import { SocialMediaMetadata } from "../../components/SocialMediaMetadata";
import {
  GQLLearningpath,
  GQLLearningpathPage_NodeFragment,
  GQLLearningpathStep,
  GQLTaxonomyCrumb,
} from "../../graphqlTypes";
import { htmlTitle } from "../../util/titleHelper";

interface Props {
  node: GQLLearningpathPage_NodeFragment;
  skipToContentId: string;
  stepId?: string;
  loading: boolean;
}

export const LearningpathPage = ({ node, skipToContentId, stepId, loading }: Props) => {
  const { t } = useTranslation();

  if (!node.learningpath || !node?.learningpath?.learningsteps?.length) {
    return <DefaultErrorMessagePage />;
  }
  const learningpath = node.learningpath;

  const learningpathStep = stepId
    ? learningpath.learningsteps?.find((step) => step.id.toString() === stepId.toString())
    : learningpath.introduction?.length
      ? undefined
      : learningpath.learningsteps?.[0];

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
            <Learningpath
              skipToContentId={skipToContentId}
              learningpath={learningpath}
              learningpathStep={learningpathStep}
              resource={node}
              resourcePath={node.url}
              loading={loading}
            />
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
          ...Learningpath_LearningpathStep
        }
        ...Learningpath_Learningpath
      }
    }
    ${Learningpath.fragments.learningpathStep}
    ${Learningpath.fragments.learningpath}
  `,
};
