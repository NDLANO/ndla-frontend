/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import parse from "html-react-parser";
import { ReactNode } from "react";
import { transform, TransformOptions } from "@ndla/article-converter";
import formatDate from "./formatDate";
import { GQLArticle, GQLFootNote, GQLTransformedArticleContent } from "../graphqlTypes";
import { LocaleType } from "../interfaces";

function getContent(content: string, { path, isOembed, subject, articleLanguage, contentType }: TransformOptions) {
  return transform(content, {
    frontendDomain: "",
    path,
    isOembed,
    subject,
    articleLanguage,
    contentType,
    canonicalUrls: {
      image: (image) => `/image/${image.id}`,
    },
  });
}

type TransformedContent = Omit<GQLTransformedArticleContent, "metaData"> & {
  metaData?: { footnotes?: GQLFootNote[]; copyText?: string };
};

export type BaseArticle = Pick<
  GQLArticle,
  "created" | "htmlTitle" | "htmlIntroduction" | "updated" | "published" | "requiredLibraries" | "revisionDate"
> & { transformedContent: TransformedContent };

export type TransformedBaseArticle<T extends BaseArticle> = Omit<T, "transformedContent"> & {
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
  const updatedOptions = options?.articleLanguage === "nb" ? { ...options, articleLanguage: "no" } : options;
  const content = getContent(article.transformedContent.content, updatedOptions ?? {});
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
    footNotes,
    requiredLibraries: article.requiredLibraries
      ? article.requiredLibraries.map((lib) => {
          if (lib?.url.startsWith("http://")) {
            return {
              ...lib,
              url: lib.url.replace("http://", "https://"),
            };
          }
          return lib;
        })
      : [],
  };
};
