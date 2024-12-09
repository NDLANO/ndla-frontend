/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, useId, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { gql } from "@apollo/client";
import { PageContent } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { ArticleContent, ArticleTitle, ArticleWrapper, ExternalEmbed } from "@ndla/ui";
import LearningpathIframe from "./LearningpathIframe";
import config from "../../config";
import {
  GQLLearningpathEmbed_LearningpathStepFragment,
  GQLLearningpathStepQuery,
  GQLLearningpathStepQueryVariables,
} from "../../graphqlTypes";
import { supportedLanguages } from "../../i18n";
import { Breadcrumb } from "../../interfaces";
import { getArticleScripts } from "../../util/getArticleScripts";
import { getContentType } from "../../util/getContentType";
import getStructuredDataFromArticle, { structuredArticleDataFragment } from "../../util/getStructuredDataFromArticle";
import { useGraphQuery } from "../../util/runQueries";
import { transformArticle } from "../../util/transformArticle";
import Article from "../Article";
import { CreatedBy } from "../Article/CreatedBy";
import { ContentPlaceholder } from "../ContentPlaceholder";
import { DefaultErrorMessage } from "../DefaultErrorMessage";

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
  learningpathStep: GQLLearningpathEmbed_LearningpathStepFragment;
  skipToContentId?: string;
  breadcrumbItems: Breadcrumb[];
  subjectId?: string;
  children?: ReactNode;
}
const LearningpathEmbed = ({ learningpathStep, skipToContentId, subjectId, breadcrumbItems, children }: Props) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [taxId, articleId] =
    !learningpathStep.resource && learningpathStep.embedUrl?.url
      ? getIdFromIframeUrl(learningpathStep.embedUrl.url)
      : [undefined, undefined];

  const fallbackId = useId();

  const shouldUseConverter =
    !!articleId &&
    !learningpathStep.resource?.article &&
    learningpathStep.embedUrl &&
    urlIsNDLAUrl(learningpathStep.embedUrl?.url);

  const { data, loading } = useGraphQuery<GQLLearningpathStepQuery, GQLLearningpathStepQueryVariables>(
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
    if (urlIsNDLAUrl(embedUrl.url)) {
      return <LearningpathIframe url={embedUrl.url} html={oembed.html} />;
    }

    return (
      <EmbedPageContent variant="content">
        <ArticleWrapper>
          <ArticleTitle id={skipToContentId ?? fallbackId} contentType="external" title={learningpathStep.title} />
          <ArticleContent>
            <section>
              <ExternalEmbed
                embed={{
                  resource: "external",
                  status: "success",
                  embedData: {
                    resource: "external",
                    url: embedUrl.url,
                  },
                  data: {
                    oembed,
                  },
                }}
              />
            </section>
          </ArticleContent>
        </ArticleWrapper>
      </EmbedPageContent>
    );
  }

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
      <Helmet>
        {!!article?.metaDescription && <meta name="description" content={article.metaDescription} />}
        {scripts.map((script) => (
          <script key={script.src} src={script.src} type={script.type} async={script.async} defer={script.defer} />
        ))}

        <script type="application/ld+json">
          {JSON.stringify(getStructuredDataFromArticle(stepArticle, i18n.language, breadcrumbItems))}
        </script>
      </Helmet>
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

const articleFragment = gql`
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

LearningpathEmbed.fragments = {
  article: articleFragment,
  learningpathStep: gql`
    fragment LearningpathEmbed_LearningpathStep on LearningpathStep {
      id
      title
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

const learningpathStepQuery = gql`
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

export default LearningpathEmbed;
