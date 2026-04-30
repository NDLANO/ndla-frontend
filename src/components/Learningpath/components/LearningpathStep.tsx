/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from "@apollo/client";
import type {
  GQLLearningpathStep_LearningpathFragment,
  GQLLearningpathStep_LearningpathStepFragment,
} from "../../../graphqlTypes";
import { supportedLanguages } from "../../../i18n";
import type { Breadcrumb } from "../../../interfaces";
import { ArticleStep } from "./ArticleStep";
import { EmbedStep } from "./EmbedStep";
import { ExternalStep } from "./ExternalStep";
import { LearningpathStepTitle } from "./LearningpathStepTitle";
import { TextStep } from "./TextStep";

const regex = new RegExp(`^\\/(${supportedLanguages.join("|")})($|\\/)`, "");

const getIdFromIframeUrl = (_url: string): [string | undefined, string | undefined] => {
  const url = _url.split("/article-iframe")?.[1]?.replace(regex, "")?.replace("article/", "")?.split("?")?.[0];

  if (url?.includes("/")) {
    const [taxId, articleId] = url.split("/");
    if (parseInt(articleId!)) {
      return [taxId, articleId];
    }
  } else if (url && parseInt(url)) {
    return [undefined, url];
  }
  return [undefined, undefined];
};

interface Props {
  learningpath: GQLLearningpathStep_LearningpathFragment;
  learningpathStep: GQLLearningpathStep_LearningpathStepFragment;
  skipToContentId?: string;
  subjectId?: string;
  isInactive?: boolean;
  ldCrumbs: Breadcrumb[];
}

export const LearningpathStep = ({
  learningpath,
  learningpathStep,
  subjectId,
  skipToContentId,
  ldCrumbs,
  isInactive,
}: Props) => {
  const [taxId, articleId] =
    !learningpathStep.resource && learningpathStep.embedUrl?.url
      ? getIdFromIframeUrl(learningpathStep.embedUrl.url)
      : [undefined, undefined];

  if (learningpathStep.type === "ARTICLE" && learningpathStep.resource) {
    return (
      <>
        <LearningpathStepTitle learningpathStep={learningpathStep} />
        <ArticleStep
          taxId={taxId}
          articleId={articleId}
          learningpathStep={learningpathStep}
          subjectId={subjectId}
          breadcrumbItems={ldCrumbs}
          skipToContentId={skipToContentId}
          isInactive={isInactive}
        />
      </>
    );
  } else if (learningpathStep.type === "EXTERNAL") {
    if (learningpathStep.oembed?.html) {
      return (
        <>
          <LearningpathStepTitle learningpathStep={learningpathStep} />
          <EmbedStep
            skipToContentId={skipToContentId}
            title={learningpathStep.title}
            url={learningpathStep.embedUrl?.url ?? ""}
            oembed={learningpathStep.oembed}
            isInactive={isInactive}
          />
        </>
      );
    } else if (learningpathStep.embedUrl?.embedType === "external") {
      return (
        <ExternalStep
          learningpathStep={learningpathStep}
          skipToContentId={skipToContentId}
          learningpath={learningpath}
          isInactive={isInactive}
        />
      );
    }
    // this is either a plain text step from stier, or a text step from my ndla.
    // There's really no way to know, so we have to make an educated guess.
  } else if (
    learningpathStep.type === "TEXT" &&
    (learningpathStep.introduction || learningpathStep.description?.startsWith("<section>"))
  ) {
    return (
      <TextStep
        learningpathStep={learningpathStep}
        skipToContentId={skipToContentId}
        learningpath={learningpath}
        isInactive={isInactive}
      />
    );
  }

  return (
    <LearningpathStepTitle
      learningpathStep={learningpathStep}
      skipToContentId={skipToContentId}
      isInactive={isInactive}
    />
  );
};

LearningpathStep.fragments = {
  learningpathStep: gql`
    fragment LearningpathStep_LearningpathStep on BaseLearningpathStep {
      id
      type
      ...ArticleStep_LearningpathStep
      ...LearningpathStepTitle_LearningpathStep
      ...TextStep_LearningpathStep
      ...ExternalStep_LearningpathStep
    }
    ${ArticleStep.fragments.learningpathStep}
    ${LearningpathStepTitle.fragments.learningpathStep}
    ${TextStep.fragments.learningpathStep}
    ${ExternalStep.fragments.learningpathStep}
  `,
  learningpath: gql`
    fragment LearningpathStep_Learningpath on BaseLearningpath {
      ...TextStep_Learningpath
      ...ExternalStep_Learningpath
    }
    ${TextStep.fragments.learningpath}
    ${ExternalStep.fragments.learningpath}
  `,
};
