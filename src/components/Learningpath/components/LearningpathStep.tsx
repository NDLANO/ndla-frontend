/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from "@apollo/client";
import { PageContent } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import {
  GQLLearningpath_LearningpathStepFragment,
  GQLLearningpath_LearningpathFragment,
  GQLLearningpathPage_NodeFragment,
} from "../../../graphqlTypes";
import { supportedLanguages } from "../../../i18n";
import { structuredArticleDataFragment } from "../../../util/getStructuredDataFromArticle";
import Article from "../../Article";
import LastLearningpathStepInfo from "../LastLearningpathStepInfo";
import { ArticleStep } from "./ArticleStep";
import { EmbedStep } from "./EmbedStep";
import { ExternalStep } from "./ExternalStep";
import { LearningpathStepTitle } from "./LearningpathStepTitle";
import { TextStep } from "./TextStep";
import { Breadcrumb } from "../../../interfaces";

export const EmbedPageContent = styled(PageContent, {
  base: {
    background: "background.default",
    tablet: {
      border: "1px solid",
      borderColor: "stroke.subtle",
      boxShadow: "small",
      borderRadius: "xsmall",
    },
  },
});

const urlIsNDLAApiUrl = (url: string) => /^(http|https):\/\/(ndla-frontend|www).([a-zA-Z]+.)?api.ndla.no/.test(url);
const urlIsNDLAEnvUrl = (url: string) => /^(http|https):\/\/(www.)?([a-zA-Z]+.)?ndla.no/.test(url);
const urlIsLocalNdla = (url: string) => /^http:\/\/(proxy.ndla-local|localhost):30017/.test(url);
const urlIsNDLAUrl = (url: string) => urlIsNDLAApiUrl(url) || urlIsNDLAEnvUrl(url) || urlIsLocalNdla(url);

const regex = new RegExp(`\\/(${supportedLanguages.join("|")})($|\\/)`, "");

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
}

export interface BaseStepProps {
  learningpathStep: GQLLearningpath_LearningpathStepFragment;
  skipToContentId?: string;
}

export const LearningpathStep = ({
  learningpath,
  learningpathStep,
  breadcrumbItems,
  subjectId,
  skipToContentId,
  resource,
}: Props) => {
  const [taxId, articleId] =
    !learningpathStep.resource && learningpathStep.embedUrl?.url
      ? getIdFromIframeUrl(learningpathStep.embedUrl.url)
      : [undefined, undefined];

  const shouldUseConverter =
    !!articleId &&
    !learningpathStep.resource?.article &&
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
        />
      </>
    );
  }

  if (learningpathStep.resource) {
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
        >
          <LastLearningpathStepInfo
            seqNo={learningpath.learningsteps.findIndex(({ id }) => id === learningpathStep.id)}
            numberOfLearningSteps={learningpath.learningsteps.length - 1}
            title={learningpath.title}
            resource={resource}
          />
        </ArticleStep>
      </>
    );
  }

  if (learningpathStep.description && learningpathStep.introduction) {
    return (
      <TextStep learningpathStep={learningpathStep} skipToContentId={skipToContentId} learningpath={learningpath} />
    );
  }

  if (learningpathStep.opengraph) {
    return (
      <ExternalStep learningpathStep={learningpathStep} skipToContentId={skipToContentId} learningpath={learningpath} />
    );
  }

  return <LearningpathStepTitle learningpathStep={learningpathStep} />;
};

export const articleFragment = gql`
  fragment LearningpathEmbed_Article on Article {
    id
    metaDescription
    created
    updated
    articleType
    requiredLibraries {
      name
      url
      mediaType
    }
    ...StructuredArticleData
    ...Article_Article
  }
  ${structuredArticleDataFragment}
  ${Article.fragments.article}
`;

LearningpathStep.fragments = {
  article: articleFragment,
  learningpathStep: gql`
    fragment LearningpathEmbed_LearningpathStep on LearningpathStep {
      id
      title
      description
      introduction
      opengraph {
        title
        description
        url
      }
      resource {
        id
        url
        resourceTypes {
          id
          name
        }
        article {
          ...LearningpathEmbed_Article
        }
      }
      embedUrl {
        embedType
        url
      }
      oembed {
        html
        width
        height
        type
        version
      }
    }
    ${articleFragment}
    ${structuredArticleDataFragment}
    ${Article.fragments.article}
  `,
};

export const learningpathStepQuery = gql`
  query learningpathStep(
    $articleId: String!
    $resourceId: String!
    $includeResource: Boolean!
    $transformArgs: TransformedArticleContentInput
  ) {
    article(id: $articleId) {
      oembed
      ...LearningpathEmbed_Article
    }
    node(id: $resourceId) @include(if: $includeResource) {
      id
      url
      resourceTypes {
        id
        name
      }
    }
  }
  ${articleFragment}
`;
