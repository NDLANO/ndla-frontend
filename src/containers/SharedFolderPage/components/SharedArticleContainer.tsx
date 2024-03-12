/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { TFunction } from "i18next";
import { useContext, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { gql } from "@apollo/client";
import { DynamicComponents } from "@ndla/article-converter";
import { useTracker } from "@ndla/tracker";
import { OneColumn } from "@ndla/ui";
import Article from "../../../components/Article";
import { AuthContext } from "../../../components/AuthenticationContext";
import AddEmbedToFolder from "../../../components/MyNdla/AddEmbedToFolder";
import SocialMediaMetadata from "../../../components/SocialMediaMetadata";
import config from "../../../config";
import { SKIP_TO_CONTENT_ID } from "../../../constants";
import {
  GQLFolderResourceMetaSearchQuery,
  GQLSharedResourceArticleContainer_ArticleFragment,
} from "../../../graphqlTypes";
import { getArticleProps } from "../../../util/getArticleProps";
import { getArticleScripts } from "../../../util/getArticleScripts";
import { getContentTypeFromResourceTypes } from "../../../util/getContentType";
import { structuredArticleDataFragment } from "../../../util/getStructuredDataFromArticle";
import { getAllDimensions } from "../../../util/trackingUtil";
import { transformArticle } from "../../../util/transformArticle";

interface Props {
  article: GQLSharedResourceArticleContainer_ArticleFragment;
  meta?: GQLFolderResourceMetaSearchQuery["folderResourceMetaSearch"][0];
  title: string;
}

const converterComponents: DynamicComponents = {
  heartButton: AddEmbedToFolder,
};

const SharedArticleContainer = ({ article: propArticle, meta, title }: Props) => {
  const { t, i18n } = useTranslation();
  const { user, authContextLoaded } = useContext(AuthContext);
  const { trackPageView } = useTracker();
  useEffect(() => {
    if (window.MathJax && typeof window.MathJax.typeset === "function") {
      try {
        window.MathJax.typeset();
      } catch (err) {
        // do nothing
      }
    }
  });

  useEffect(() => {
    if (propArticle && authContextLoaded) {
      const contentType = getContentTypeFromResourceTypes(meta?.resourceTypes);
      const dimensions = getAllDimensions({ article: propArticle, user });
      trackPageView({
        dimensions,
        title: getDocumentTitle(propArticle.title, contentType?.label, t),
      });
    }
  }, [authContextLoaded, user, meta?.resourceTypes, propArticle, t, trackPageView]);

  const [article, scripts] = useMemo(() => {
    return [
      transformArticle(propArticle, i18n.language, {
        path: `${config.ndlaFrontendDomain}/article/${propArticle.id}`,
        components: converterComponents,
        articleLanguage: propArticle.language,
      }),
      getArticleScripts(propArticle, i18n.language),
    ];
  }, [propArticle, i18n.language]);

  const contentType = meta?.resourceTypes && getContentTypeFromResourceTypes(meta.resourceTypes);

  return (
    <OneColumn>
      <Helmet title={getDocumentTitle(title, contentType?.label, t)}>
        {scripts.map((script) => (
          <script key={script.src} src={script.src} type={script.type} async={script.async} defer={script.defer} />
        ))}
      </Helmet>
      <SocialMediaMetadata
        title={title}
        imageUrl={article.metaImage?.url}
        trackableContent={article}
        description={article.metaDescription}
      />
      <Article
        contentTransformed
        id={SKIP_TO_CONTENT_ID}
        article={article}
        {...getArticleProps(undefined, undefined)}
        contentType={contentType?.contentType}
        label={contentType?.label || ""}
      />
    </OneColumn>
  );
};

const getDocumentTitle = (title: string, contentType: string | undefined, t: TFunction) =>
  t("htmlTitles.sharedFolderPage", {
    name: `${title}${contentType ? ` - ${contentType}` : ""}`,
  });

export default SharedArticleContainer;

export const sharedArticleContainerFragments = {
  article: gql`
    fragment SharedResourceArticleContainer_Article on Article {
      created
      tags
      ...Article_Article
      ...StructuredArticleData
    }
    ${structuredArticleDataFragment}
    ${Article.fragments.article}
  `,
};
