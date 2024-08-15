/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactElement, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { gql } from "@apollo/client";
import { useComponentSize } from "@ndla/hooks";
import { Article as UIArticle } from "@ndla/ui";
import { useArticleCopyText } from "./articleHelpers";
import FavoriteButton from "./FavoritesButton";
import { MastheadHeightPx } from "../../constants";
import { GQLArticle_ArticleFragment } from "../../graphqlTypes";
import { TransformedBaseArticle } from "../../util/transformArticle";
import CompetenceGoals from "../CompetenceGoals";
import LicenseBox from "../license/LicenseBox";
import AddResourceToFolderModal from "../MyNdla/AddResourceToFolderModal";

interface Props {
  id?: string;
  article: TransformedBaseArticle<GQLArticle_ArticleFragment>;
  isTopicArticle?: boolean;
  children?: ReactElement;
  contentType?: string;
  printUrl?: string;
  subjectId?: string;
  isOembed?: boolean;
  showFavoriteButton?: boolean;
  myNdlaResourceType?: string;
  path?: string;
  oembed: string | undefined;
}

const Article = ({
  path,
  article,
  isTopicArticle = false,
  children,
  contentType,
  printUrl,
  id,
  subjectId,
  isOembed = false,
  showFavoriteButton,
  myNdlaResourceType = "article",
  oembed,
}: Props) => {
  const { height = MastheadHeightPx } = useComponentSize("masthead");
  const copyText = useArticleCopyText(article);

  const location = useLocation();

  // Scroll to element with ID passed in as a query-parameter.
  // We use query-params instead of the regular fragments since
  // the article doesn't exist on initial page load (At least without SSR).
  useEffect(() => {
    if (location.hash && article?.transformedContent?.content) {
      setTimeout(() => {
        const element = document.getElementById(location.hash.slice(1));
        const elementTop = element?.getBoundingClientRect().top ?? 0;
        const bodyTop = document.body.getBoundingClientRect().top ?? 0;
        const absoluteTop = elementTop - bodyTop;
        const scrollPosition = absoluteTop - height - 20;

        window.scrollTo({
          top: scrollPosition,
          behavior: "smooth",
        });
      }, 400);
    }
  }, [article?.transformedContent?.content, location, height]);

  if (!article) {
    return children || null;
  }

  const art = {
    ...article,
    content: article.transformedContent?.content ?? "",
    title: article.transformedContent.title,
    introduction: article.transformedContent.introduction,
    footNotes: article.transformedContent?.metaData?.footnotes ?? [],
  };

  return (
    <UIArticle
      id={id ?? article.id.toString()}
      article={art}
      contentType={contentType}
      licenseBox={<LicenseBox article={article} copyText={copyText} printUrl={printUrl} oembed={oembed} />}
      competenceGoals={
        !isTopicArticle && article.grepCodes?.filter((gc) => gc.toUpperCase().startsWith("K")).length ? (
          <CompetenceGoals
            codes={article.grepCodes}
            subjectId={subjectId}
            supportedLanguages={article.supportedLanguages}
            isOembed={isOembed}
          />
        ) : undefined
      }
      lang={article.language === "nb" ? "no" : article.language}
      heartButton={
        path &&
        showFavoriteButton && (
          <AddResourceToFolderModal
            resource={{
              id: article.id.toString(),
              path,
              resourceType: myNdlaResourceType,
            }}
          >
            <FavoriteButton path={path} />
          </AddResourceToFolderModal>
        )
      }
    >
      {children}
    </UIArticle>
  );
};

Article.fragments = {
  article: gql`
    fragment Article_Article on Article {
      id
      created
      updated
      supportedLanguages
      grepCodes
      htmlIntroduction
      htmlTitle
      transformedContent(transformArgs: $transformArgs) {
        content
        metaData {
          copyText
          footnotes {
            ref
            title
            year
            authors
            edition
            publisher
            url
          }
        }
      }
      language
      ...LicenseBox_Article
    }
    ${LicenseBox.fragments.article}
  `,
};
export default Article;
