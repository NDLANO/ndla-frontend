/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { BaseStepProps, learningpathStepQuery, EmbedPageContent } from "./LearningpathStep";
import config from "../../../config";
import { GQLLearningpathStepQuery, GQLLearningpathStepQueryVariables } from "../../../graphqlTypes";
import { Breadcrumb } from "../../../interfaces";
import { getArticleScripts } from "../../../util/getArticleScripts";
import { getContentType } from "../../../util/getContentType";
import getStructuredDataFromArticle from "../../../util/getStructuredDataFromArticle";
import { transformArticle } from "../../../util/transformArticle";
import Article from "../../Article";
import { CreatedBy } from "../../Article/CreatedBy";
import { ContentPlaceholder } from "../../ContentPlaceholder";
import { DefaultErrorMessage } from "../../DefaultErrorMessage";

interface ArticleStepProps extends BaseStepProps {
  breadcrumbItems: Breadcrumb[];
  subjectId?: string;
  taxId?: string;
  articleId?: string;
  children?: ReactNode;
}

export const ArticleStep = ({
  learningpathStep,
  skipToContentId,
  subjectId,
  breadcrumbItems,
  articleId,
  taxId,
  children,
}: ArticleStepProps) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();

  const { data, loading } = useQuery<GQLLearningpathStepQuery, GQLLearningpathStepQueryVariables>(
    learningpathStepQuery,
    {
      variables: {
        articleId: articleId ?? learningpathStep.resource?.article?.id.toString() ?? "",
        resourceId: taxId ?? "",
        includeResource: !!taxId,
        transformArgs: {
          path: location.pathname,
          subjectId,
          prettyUrl: true,
        },
      },
      skip:
        !!learningpathStep.resource?.article ||
        !articleId ||
        (!learningpathStep.embedUrl && !learningpathStep.resource),
    },
  );

  const url = !learningpathStep.resource?.url ? data?.node?.url : undefined;
  const contentUrl = url ? `${config.ndlaFrontendDomain}${url}` : undefined;

  const [article, scripts] = useMemo(() => {
    const article = learningpathStep.resource?.article ? learningpathStep.resource.article : data?.article;
    if (!article) return [undefined, undefined];
    return [
      transformArticle(article, i18n.language, {
        path: `${config.ndlaFrontendDomain}/article/${article.id}`,
        subject: subjectId,
        articleLanguage: article.language,
        contentType: getContentType(learningpathStep.resource),
      }),
      getArticleScripts(article, i18n.language),
    ];
  }, [data?.article, i18n.language, learningpathStep.resource, subjectId]);

  if (loading) {
    return (
      <EmbedPageContent>
        <ContentPlaceholder variant="article" />
      </EmbedPageContent>
    );
  }

  if (!article || !scripts) {
    return null;
  }

  const learningpathStepResource = learningpathStep.resource ?? data;
  const resource = learningpathStep.resource ?? data?.node;
  const stepArticle = learningpathStepResource?.article;

  if (!stepArticle) {
    return <DefaultErrorMessage applySkipToContentId={!!skipToContentId} />;
  }

  return (
    <EmbedPageContent variant="content">
      {!!article?.metaDescription && <meta name="description" content={article.metaDescription} />}
      {scripts.map((script) => (
        <script key={script.src} src={script.src} type={script.type} async={script.async} defer={script.defer} />
      ))}
      <script type="application/ld+json">
        {JSON.stringify(getStructuredDataFromArticle(stepArticle, i18n.language, breadcrumbItems))}
      </script>
      <Article
        id={skipToContentId}
        article={article}
        oembed={data?.article?.oembed}
        contentTypeLabel={resource?.resourceTypes?.[0]?.name}
        contentType={article.articleType === "topic-article" ? "topic-article" : getContentType(resource)}
      >
        {children}
        {!!url && <CreatedBy name={t("createdBy.content")} description={t("createdBy.text")} url={contentUrl} />}
      </Article>
    </EmbedPageContent>
  );
};
