/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { deserializeToRichText, serializeFromRichText } from "../../../components/RichTextEditor/richTextSerialization";
import type { GQLMyNdlaLearningpathStepFragment } from "../../../graphqlTypes";
import { unreachable } from "../../../util/guards";
import type { FormValues } from "./types";

export const toFormValues = <T extends FormValues["type"]>(
  type: T,
  step?: GQLMyNdlaLearningpathStepFragment,
): FormValues => {
  switch (type) {
    case "TEXT":
      return {
        type: "TEXT",
        title: step?.title ?? "",
        introduction: step?.introduction ?? "",
        description: deserializeToRichText(step?.description ?? ""),
      };
    case "EXTERNAL":
      return {
        type: type,
        title: step?.title ?? "",
        introduction: step?.introduction ?? "",
        url: step?.embedUrl?.url ?? "",
        shareable: !!step?.embedUrl?.url,
      };
    case "ARTICLE":
    case "FOLDER":
      return {
        type: type,
        title: step?.title ?? "",
        embedUrl: step?.embedUrl?.url ?? "",
        articleId: step?.articleId,
      };
    default:
      return unreachable(type);
  }
};

export const formValuesToGQLInput = (values: FormValues) => {
  if (values.type === "TEXT") {
    return {
      type: "TEXT",
      title: values.title,
      introduction: values.introduction,
      description: serializeFromRichText(values.description),
      embedUrl: null,
      articleId: null,
    };
  }

  if (values.type === "EXTERNAL") {
    return {
      type: "EXTERNAL",
      title: values.title,
      introduction: values.introduction,
      description: null,
      articleId: null,
      embedUrl: {
        url: values.url,
        embedType: "external",
      },
    };
  }

  if (values.type === "ARTICLE") {
    return {
      type: "ARTICLE",
      title: values.title,
      articleId: values.articleId,
      introduction: null,
      description: null,
      embedUrl: values.articleId ? null : { url: values.embedUrl, embedType: "iframe" },
    };
  }

  return {
    type: "ARTICLE",
    title: values.title,
    articleId: values.articleId,
    introduction: null,
    description: null,
    embedUrl: values.articleId
      ? null
      : {
          url: values.embedUrl,
          embedType: "iframe",
        },
  };
};
