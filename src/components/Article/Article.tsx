/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from "react";
import { gql } from "@apollo/client";
import { Article as UIArticle } from "@ndla/ui";
import { useArticleCopyText, useNavigateToHash } from "./articleHelpers";
import FavoriteButton from "./FavoritesButton";
import { GQLArticle_ArticleFragment } from "../../graphqlTypes";
import { TransformedBaseArticle } from "../../util/transformArticle";
import CompetenceGoals from "../CompetenceGoals";
import LicenseBox from "../license/LicenseBox";
import AddResourceToFolderModal from "../MyNdla/AddResourceToFolderModal";

interface Props {
  id?: string;
  article: TransformedBaseArticle<GQLArticle_ArticleFragment>;
  isTopicArticle?: boolean;
  children?: ReactNode;
  contentType?: string;
  printUrl?: string;
  subjectId?: string;
  isOembed?: boolean;
  contentTypeLabel?: ReactNode;
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
  contentTypeLabel,
  oembed,
}: Props) => {
  const copyText = useArticleCopyText(article);

  useNavigateToHash(article.transformedContent.content);

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
      contentTypeLabel={contentTypeLabel}
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
