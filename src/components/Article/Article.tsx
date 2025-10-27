/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { gql } from "@apollo/client";
import { HTMLProps } from "@ark-ui/react";
import { styled } from "@ndla/styled-system/jsx";
import {
  ArticleByline,
  ArticleContent,
  ArticleFooter,
  ArticleTitle,
  ArticleWrapper,
  licenseAttributes,
} from "@ndla/ui";
import { useArticleCopyText, useNavigateToHash } from "./articleHelpers";
import { GQLArticle_ArticleFragment } from "../../graphqlTypes";
import { TransformedBaseArticle } from "../../util/transformArticle";
import { CompetenceGoals } from "../CompetenceGoals";
import { Disclaimer } from "../Disclaimer";
import { FavoriteButton } from "./FavoritesButton";
import { LicenseBox } from "../license/LicenseBox";
import { AddResourceToFolderModal } from "../MyNdla/AddResourceToFolderModal";

interface Props extends HTMLProps<"div"> {
  id?: string;
  article: TransformedBaseArticle<GQLArticle_ArticleFragment>;
  isTopicArticle?: boolean;
  children?: ReactNode;
  contentType?: string;
  printUrl?: string;
  subjectId?: string;
  isOembed?: boolean;
  contentTypeLabel?: ReactNode;
  path?: string;
}

const StyledArticleContent = styled(ArticleContent, {
  base: {
    overflowX: "visible",
  },
});

export const Article = ({
  path,
  article,
  isTopicArticle = false,
  children,
  contentType,
  printUrl,
  id,
  subjectId,
  isOembed = false,
  contentTypeLabel,
  ...rest
}: Props) => {
  const { i18n } = useTranslation();
  const copyText = useArticleCopyText(article);

  useNavigateToHash(article.transformedContent.content);

  if (!article) {
    return children || null;
  }

  const authors =
    article.copyright?.creators.length || article.copyright?.rightsholders.length
      ? article.copyright.creators
      : article.copyright?.processors;

  const licenseProps = licenseAttributes(article.copyright?.license?.license, i18n.language, undefined);

  return (
    <ArticleWrapper {...licenseProps} {...rest}>
      <ArticleTitle
        id={id ?? article.id.toString()}
        contentType={contentType}
        contentTypeLabel={contentTypeLabel}
        heartButton={
          !!path && (
            <AddResourceToFolderModal
              resource={{
                id: article.id.toString(),
                path,
                resourceType: "article",
              }}
            >
              <FavoriteButton path={path} />
            </AddResourceToFolderModal>
          )
        }
        title={article.transformedContent.title}
        introduction={article.transformedContent.introduction}
        competenceGoals={
          !isTopicArticle && article.grepCodes?.filter((gc) => gc.toUpperCase().startsWith("K")).length ? (
            <CompetenceGoals
              codes={article.grepCodes}
              supportedLanguages={article.supportedLanguages}
              subjectId={subjectId}
              isOembed={isOembed}
            />
          ) : undefined
        }
        lang={article.language}
        disclaimer={
          article.transformedDisclaimer.content ? <Disclaimer disclaimer={article.transformedDisclaimer} /> : null
        }
      />
      <StyledArticleContent>{article.transformedContent.content ?? ""}</StyledArticleContent>
      <ArticleFooter>
        <ArticleByline
          footnotes={article.transformedContent.metaData?.footnotes ?? []}
          authors={authors}
          suppliers={article.copyright?.rightsholders}
          published={article.published}
          licenseBox={<LicenseBox article={article} copyText={copyText} printUrl={printUrl} oembed={article.oembed} />}
        />
        {children}
      </ArticleFooter>
    </ArticleWrapper>
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
      oembed
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
      transformedDisclaimer {
        content
      }
      ...LicenseBox_Article
    }
    ${LicenseBox.fragments.article}
  `,
};
