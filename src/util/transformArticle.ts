/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { transform, TransformOptions } from "@ndla/article-converter";
import parse from "html-react-parser";
import { ReactNode } from "react";
import { GQLArticle, GQLFootNote, GQLResourceEmbed, GQLTransformedArticleContent } from "../graphqlTypes";
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

type TransformedVisualElement = Omit<GQLResourceEmbed, "meta">;

type TransformedContent = Omit<GQLTransformedArticleContent, "metaData" | "visualElementEmbed"> & {
  metaData?: { footnotes?: GQLFootNote[]; copyText?: string };
  visualElementEmbed?: TransformedVisualElement;
};

export type BaseArticle = Pick<
  GQLArticle,
  | "created"
  | "htmlTitle"
  | "htmlIntroduction"
  | "updated"
  | "published"
  | "revised"
  | "requiredLibraries"
  | "revisionDate"
> & { transformedContent: TransformedContent };

export type TransformedBaseArticle<T extends BaseArticle> = Omit<T, "transformedContent"> & {
  originalCreated?: string;
  originalPublished?: string;
  originalUpdated?: string;
  transformedContent: T["transformedContent"] & {
    content: ReactNode;
    introduction: ReactNode;
    title: ReactNode;
  };
};
export const transformArticle = <T extends BaseArticle>(
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
    requiredLibraries: article.requiredLibraries ?? [],
  };
};
