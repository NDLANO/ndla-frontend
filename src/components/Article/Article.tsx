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
import { Badge } from "@ndla/primitives";
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
import { useListItemTraits } from "../../util/listItemTraits";
import { TransformedBaseArticle } from "../../util/transformArticle";
import { CompetenceGoals } from "../CompetenceGoals";
import { Disclaimer } from "../Disclaimer";
import { FavoriteButton } from "./FavoritesButton";
import { InactiveMessageBox } from "../InactiveMessageBox";
import { LicenseBox } from "../license/LicenseBox";
import { AddResourceToFolderModal } from "../MyNdla/AddResourceToFolderModal";

interface Props extends HTMLProps<"div"> {
  id?: string;
  article: TransformedBaseArticle<GQLArticle_ArticleFragment>;
  isTopicArticle?: boolean;
  children?: ReactNode;
  isInactive?: boolean;
  contentType?: string;
  subjectId?: string;
  isOembed?: boolean;
  path?: string;
  relevanceId?: string;
  resourceTypes?: { id: string; name: string }[];
}

const StyledArticleContent = styled(ArticleContent, {
  base: {
    overflowX: "visible",
  },
});

const StyledArticleWrapper = styled(ArticleWrapper, {
  base: {
    _print: {
      // Grid somehow causes overlapping in footer when printing. This only happens in Chromium.
      display: "block",
    },
  },
});

export const Article = ({
  path,
  article,
  isTopicArticle = false,
  children,
  contentType,
  id,
  subjectId,
  isOembed = false,
  isInactive,
  resourceTypes,
  relevanceId,
  ...rest
}: Props) => {
  const { i18n } = useTranslation();
  const copyText = useArticleCopyText(article);

  useNavigateToHash(article.transformedContent.content);

  const traits = useListItemTraits({ contentType, traits: article.traits, relevanceId, resourceTypes });

  if (!article) {
    return children || null;
  }

  const authors =
    article.copyright?.creators.length || article.copyright?.rightsholders.length
      ? article.copyright.creators
      : article.copyright?.processors;

  const licenseProps = licenseAttributes(article.copyright?.license?.license, i18n.language, undefined);

  return (
    <StyledArticleWrapper {...licenseProps} {...rest}>
      <ArticleTitle
        id={id ?? article.id.toString()}
        badges={traits.length ? traits.map((trait) => <Badge key={trait}>{trait}</Badge>) : undefined}
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
      >
        {!!isInactive && <InactiveMessageBox />}
      </ArticleTitle>
      <StyledArticleContent>{article.transformedContent.content ?? ""}</StyledArticleContent>
      <ArticleFooter>
        <ArticleByline
          footnotes={article.transformedContent.metaData?.footnotes ?? []}
          authors={authors}
          suppliers={article.copyright?.rightsholders}
          published={article.published}
          licenseBox={<LicenseBox article={article} copyText={copyText} oembed={article.oembed} />}
        />
        {children}
      </ArticleFooter>
    </StyledArticleWrapper>
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
      traits
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
