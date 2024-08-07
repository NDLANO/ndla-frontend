/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { gql } from "@apollo/client";
import styled from "@emotion/styled";
import { spacing } from "@ndla/core";
import LearningpathIframe, { urlIsNDLAUrl } from "./LearningpathIframe";
import config from "../../config";
import ErrorPage from "../../containers/ErrorPage";
import {
  GQLLearningpathEmbed_LearningpathStepFragment,
  GQLLearningpathEmbed_TopicFragment,
  GQLLearningpathStepQuery,
  GQLLearningpathStepQueryVariables,
} from "../../graphqlTypes";
import { supportedLanguages } from "../../i18n";
import { Breadcrumb } from "../../interfaces";
import { getArticleProps } from "../../util/getArticleProps";
import { getArticleScripts } from "../../util/getArticleScripts";
import getStructuredDataFromArticle, { structuredArticleDataFragment } from "../../util/getStructuredDataFromArticle";
import { useGraphQuery } from "../../util/runQueries";
import { transformArticle } from "../../util/transformArticle";
import Article from "../Article";
import { CreatedBy } from "../Article/CreatedBy";
import { PageSpinner } from "../PageSpinner";

interface StyledIframeContainerProps {
  oembedWidth: number;
  oembedHeight: number;
}
const StyledIframeContainer = styled.div<StyledIframeContainerProps>`
  margin-bottom: ${spacing.normal};
  & > iframe {
    padding-top: 1em;
    border: 0 none;
    max-width: 100%;
    width: ${(p) => p.oembedWidth}px;
    height: ${(p) => p.oembedHeight}px;
  }
`;

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
  learningpathStep: GQLLearningpathEmbed_LearningpathStepFragment;
  topic?: GQLLearningpathEmbed_TopicFragment;
  skipToContentId?: string;
  breadcrumbItems: Breadcrumb[];
  subjectId?: string;
}
const LearningpathEmbed = ({ learningpathStep, skipToContentId, topic, subjectId, breadcrumbItems }: Props) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [taxId, articleId] =
    !learningpathStep.resource && learningpathStep.embedUrl?.url
      ? getIdFromIframeUrl(learningpathStep.embedUrl.url)
      : [undefined, undefined];

  const shouldUseConverter =
    !!articleId &&
    !learningpathStep.resource?.article &&
    learningpathStep.embedUrl &&
    urlIsNDLAUrl(learningpathStep.embedUrl?.url);

  const { data, loading } = useGraphQuery<GQLLearningpathStepQuery, GQLLearningpathStepQueryVariables>(
    learningpathStepQuery,
    {
      variables: {
        articleId: articleId ?? learningpathStep.resource?.article?.id.toString()!,
        resourceId: taxId ?? "",
        includeResource: !!taxId,
        subjectId,
        transformArgs: {
          path: location.pathname,
          subjectId,
        },
      },
      skip: !!learningpathStep.resource?.article || (!learningpathStep.embedUrl && !learningpathStep.resource),
    },
  );

  const path = !learningpathStep.resource?.path ? data?.resource?.path : undefined;
  const contentUrl = path ? `${config.ndlaFrontendDomain}${path}` : undefined;

  const [article, scripts] = useMemo(() => {
    const article = learningpathStep.resource?.article ? learningpathStep.resource.article : data?.article;
    if (!article) return [undefined, undefined];
    return [
      transformArticle(article, i18n.language, {
        path: `${config.ndlaFrontendDomain}/article/${article.id}`,
        subject: subjectId,
        articleLanguage: article.language,
      }),
      getArticleScripts(article, i18n.language),
    ];
  }, [data?.article, i18n.language, learningpathStep.resource?.article, subjectId]);

  if (!learningpathStep || (!learningpathStep.resource && (!learningpathStep.embedUrl || !learningpathStep.oembed))) {
    return null;
  }
  const { embedUrl, oembed } = learningpathStep;
  if (
    !learningpathStep.resource &&
    !shouldUseConverter &&
    embedUrl &&
    (embedUrl.embedType === "oembed" || embedUrl.embedType === "iframe") &&
    oembed &&
    oembed.html
  ) {
    return (
      <StyledIframeContainer oembedWidth={oembed.width} oembedHeight={oembed.height}>
        <LearningpathIframe html={oembed.html} url={embedUrl.url} />
      </StyledIframeContainer>
    );
  }

  if (!article || !scripts) {
    return null;
  }

  if (loading) {
    return <PageSpinner />;
  }

  const learningpathStepResource = learningpathStep.resource ?? data;
  const resource = learningpathStep.resource ?? data?.resource;
  const stepArticle = learningpathStepResource?.article;

  if (!stepArticle) {
    return <ErrorPage />;
  }

  return (
    <>
      <Helmet>
        {article && article.metaDescription && <meta name="description" content={article.metaDescription} />}
        {scripts.map((script) => (
          <script key={script.src} src={script.src} type={script.type} async={script.async} defer={script.defer} />
        ))}

        <script type="application/ld+json">
          {JSON.stringify(getStructuredDataFromArticle(stepArticle, i18n.language, breadcrumbItems))}
        </script>
      </Helmet>
      <Article
        isPlainArticle
        id={skipToContentId}
        article={article}
        oembed={data?.article?.oembed}
        {...getArticleProps(resource, topic)}
      >
        {path ? <CreatedBy name={t("createdBy.content")} description={t("createdBy.text")} url={contentUrl} /> : <></>}
      </Article>
    </>
  );
};

const articleFragment = gql`
  fragment LearningpathEmbed_Article on Article {
    id
    metaDescription
    created
    updated
    metaDescription
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

LearningpathEmbed.fragments = {
  topic: gql`
    fragment LearningpathEmbed_Topic on Topic {
      supplementaryResources(subjectId: $subjectId) {
        id
      }
    }
  `,
  article: articleFragment,
  learningpathStep: gql`
    fragment LearningpathEmbed_LearningpathStep on LearningpathStep {
      resource {
        id
        path
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
      }
    }
    ${articleFragment}
    ${structuredArticleDataFragment}
    ${Article.fragments.article}
  `,
};

const learningpathStepQuery = gql`
  query learningpathStep(
    $articleId: String!
    $resourceId: String!
    $includeResource: Boolean!
    $subjectId: String
    $transformArgs: TransformedArticleContentInput
  ) {
    article(id: $articleId) {
      oembed
      ...LearningpathEmbed_Article
    }
    resource(id: $resourceId) @include(if: $includeResource) {
      id
      path
      resourceTypes {
        id
        name
      }
    }
  }
  ${articleFragment}
`;

export default LearningpathEmbed;
