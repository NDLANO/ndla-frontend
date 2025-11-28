/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from "@apollo/client";
import {
  GQLLearningpath_LearningpathStepFragment,
  GQLLearningpath_LearningpathFragment,
  GQLLearningpathPage_NodeFragment,
} from "../../../graphqlTypes";
import { supportedLanguages } from "../../../i18n";
import { LastLearningpathStepInfo } from "../LastLearningpathStepInfo";
import { ArticleStep } from "./ArticleStep";
import { EmbedStep } from "./EmbedStep";
import { ExternalStep } from "./ExternalStep";
import { LearningpathStepTitle } from "./LearningpathStepTitle";
import { TextStep } from "./TextStep";
import { Breadcrumb } from "../../../interfaces";

const urlIsNDLAApiUrl = (url: string) => /^(http|https):\/\/(ndla-frontend|www).([a-zA-Z]+.)?api.ndla.no/.test(url);
const urlIsNDLAEnvUrl = (url: string) => /^(http|https):\/\/(www.)?([a-zA-Z]+.)?ndla.no/.test(url);
const urlIsLocalNdla = (url: string) => /^http:\/\/(proxy.ndla-local|localhost):30017/.test(url);
const urlIsNDLAUrl = (url: string) => urlIsNDLAApiUrl(url) || urlIsNDLAEnvUrl(url) || urlIsLocalNdla(url);

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
  learningpath: GQLLearningpath_LearningpathFragment;
  learningpathStep: GQLLearningpath_LearningpathStepFragment;
  resource?: GQLLearningpathPage_NodeFragment;
  skipToContentId?: string;
  breadcrumbItems: Breadcrumb[];
  subjectId?: string;
  isInactive?: boolean;
}

export const LearningpathStep = ({
  learningpath,
  learningpathStep,
  breadcrumbItems,
  subjectId,
  skipToContentId,
  resource,
  isInactive,
}: Props) => {
  const [taxId, articleId] =
    !learningpathStep.resource && learningpathStep.embedUrl?.url
      ? getIdFromIframeUrl(learningpathStep.embedUrl.url)
      : [undefined, undefined];

  const lastLearningpathStepInfo = (
    <LastLearningpathStepInfo
      seqNo={learningpath.learningsteps.findIndex(({ id }) => id === learningpathStep.id)}
      numberOfLearningSteps={learningpath.learningsteps.length - 1}
      title={learningpath.title}
      resource={resource}
    />
  );

  const shouldUseConverter =
    !!articleId &&
    !!learningpathStep.resource?.article &&
    !!learningpathStep.embedUrl &&
    urlIsNDLAUrl(learningpathStep.embedUrl?.url);

  if (
    !shouldUseConverter &&
    !learningpathStep.resource &&
    learningpathStep.oembed?.html &&
    (learningpathStep.embedUrl?.embedType === "oembed" || learningpathStep.embedUrl?.embedType === "iframe")
  ) {
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
        {lastLearningpathStepInfo}
      </>
    );
  } else if (learningpathStep.resource) {
    return (
      <>
        <LearningpathStepTitle learningpathStep={learningpathStep} />
        <ArticleStep
          taxId={taxId}
          articleId={articleId}
          learningpathStep={learningpathStep}
          subjectId={subjectId}
          breadcrumbItems={breadcrumbItems}
          skipToContentId={skipToContentId}
          isInactive={isInactive}
        />
        {lastLearningpathStepInfo}
      </>
    );
  } else if (learningpathStep.embedUrl?.embedType === "external") {
    return (
      <>
        <ExternalStep
          learningpathStep={learningpathStep}
          skipToContentId={skipToContentId}
          learningpath={learningpath}
          isInactive={isInactive}
        />
        {lastLearningpathStepInfo}
      </>
    );
    // this is either a plain text step from stier, or a text step from my ndla.
    // There's really no way to know, so we have to make an educated guess.
  } else if (learningpathStep.introduction || learningpathStep.description?.startsWith("<section>")) {
    return (
      <>
        <TextStep
          learningpathStep={learningpathStep}
          skipToContentId={skipToContentId}
          learningpath={learningpath}
          isInactive={isInactive}
        />
        {lastLearningpathStepInfo}
      </>
    );
  } else {
    return (
      <>
        <LearningpathStepTitle
          learningpathStep={learningpathStep}
          skipToContentId={skipToContentId}
          isInactive={isInactive}
        />
        {lastLearningpathStepInfo}
      </>
    );
  }
};

LearningpathStep.fragments = {
  learningpathStep: gql`
    fragment LearningpathStep_LearningpathStep on LearningpathStep {
      ...ArticleStep_LearningpathStep
    }
    ${ArticleStep.fragments.learningpathStep}
  `,
};
