/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from "@apollo/client";
import { transform, TransformOptions } from "@ndla/article-converter";
import { ArticleType } from "@ndla/ui";
import parse from "html-react-parser";
import { ReactNode } from "react";
import { GQLBaseArticleFragment } from "../graphqlTypes";
import { LocaleType } from "../interfaces";
import { formatDate } from "./formatDate";

function getContent(content: string, { path, isOembed, subject, articleLanguage }: TransformOptions) {
  return transform(content, {
    frontendDomain: "",
    path,
    isOembed,
    subject,
    articleLanguage,
    canonicalUrls: {
      image: (image) => `/image/${image.id}`,
    },
  });
}

export const baseArticleFragment = gql`
  fragment BaseArticle on Article {
    id
    created
    htmlTitle
    htmlIntroduction
    updated
    published
    revised
    revisionDate
    transformedContent(transformArgs: $transformArgs) {
      content
      metaData {
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
  }
`;

export type TransformedBaseArticle<T extends GQLBaseArticleFragment> = Omit<T, "transformedContent"> & {
  originalCreated?: string;
  originalPublished?: string;
  originalUpdated?: string;
  transformedContent: T["transformedContent"] & {
    content: ReactNode;
    introduction: ReactNode;
    title: ReactNode;
    metaData: T["transformedContent"]["metaData"] & {
      footnotes: ArticleType["footNotes"];
    };
  };
};
export const transformArticle = <T extends GQLBaseArticleFragment>(
  article: T,
  locale: LocaleType,
  options?: TransformOptions,
): TransformedBaseArticle<T> => {
  const content = getContent(article.transformedContent.content, options ?? {});
  const footNotes = article?.transformedContent?.metaData?.footnotes ?? [];
  return {
    ...article,
    transformedContent: {
      ...article.transformedContent,
      introduction: parse(article.htmlIntroduction ?? ""),
      title: parse(article.htmlTitle ?? ""),
      content,
      metaData: {
        ...article.transformedContent?.metaData,
        footnotes: footNotes.map((note) => ({
          ref: note.ref,
          title: note.title,
          year: note.year,
          authors: note.authors,
          edition: note.edition ?? undefined,
          publisher: note.publisher ?? undefined,
          url: note.url ?? undefined,
        })),
      },
    },
    created: formatDate(article.created, locale),
    updated: formatDate(article.updated, locale),
    published: formatDate(article.published, locale),
    revised: formatDate(article.revised, locale),
    originalCreated: article.created,
    originalUpdated: article.updated,
    originalPublished: article.published,
    originalRevised: article.revised,
    footNotes,
  };
};
