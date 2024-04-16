/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from "react";
import { transform, TransformOptions } from "@ndla/article-converter";
import formatDate from "./formatDate";
import { GQLArticle } from "../graphqlTypes";
import { LocaleType } from "../interfaces";

function getContent(content: string, { path, isOembed, subject, components, articleLanguage }: TransformOptions) {
  return transform(content, {
    frontendDomain: "",
    path,
    isOembed,
    subject,
    components,
    articleLanguage,
    canonicalUrls: {
      image: (image) => `/image/${image.id}`,
    },
  });
}

export type BaseArticle = Pick<
  GQLArticle,
  "transformedContent" | "introduction" | "created" | "updated" | "published" | "requiredLibraries" | "revisionDate"
>;

export type TransformedBaseArticle<T extends BaseArticle> = Omit<T, "transformedContent" | "introduction"> & {
  introduction: ReactNode;
  transformedContent: Omit<T["transformedContent"], "content"> & { content: JSX.Element };
};
export const transformArticle = <T extends BaseArticle>(
  article: T,
  locale: LocaleType,
  options?: TransformOptions,
): TransformedBaseArticle<T> => {
  const updatedOptions = options?.articleLanguage === "nb" ? { ...options, articleLanguage: "no" } : options;
  const content = getContent(article.transformedContent.content, updatedOptions ?? {});
  const footNotes = article?.transformedContent?.metaData?.footnotes ?? [];
  //@ts-ignore
  return {
    ...article,
    transformedContent: {
      ...article.transformedContent,
      content,
    },
    introduction: transform(article.introduction ?? "", {}),
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
