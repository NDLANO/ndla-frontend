/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { deserializeToRichText, serializeFromRichText } from "../../../components/RichTextEditor/richTextSerialization";
import { GQLMyNdlaLearningpathStepFragment } from "../../../graphqlTypes";
import { unreachable } from "../../../util/guards";
import { FormValues } from "./types";

export const toFormValues = <T extends FormValues["type"]>(
  type: T,
  step?: GQLMyNdlaLearningpathStepFragment,
): FormValues => {
  switch (type) {
    case "text":
      return {
        type: "text",
        title: step?.title ?? "",
        introduction: step?.introduction ?? "",
        description: deserializeToRichText(step?.description ?? ""),
      };
    case "external":
      return {
        type: type,
        title: step?.title ?? "",
        introduction: step?.introduction ?? "",
        url: step?.embedUrl?.url ?? "",
        shareable: !!step?.embedUrl?.url,
      };
    case "resource":
    case "folder":
      return {
        type: type,
        title: step?.title ?? "",
        embedUrl: step?.embedUrl?.url ?? "",
      };
    default:
      return unreachable(type);
  }
};

export const formValuesToGQLInput = (values: FormValues) => {
  if (values.type === "text") {
    return {
      type: "TEXT",
      title: values.title,
      introduction: values.introduction,
      description: serializeFromRichText(values.description),
    };
  }

  if (values.type === "external") {
    return {
      type: "TEXT",
      title: values.title,
      introduction: values.introduction,
      embedUrl: {
        url: values.url,
        embedType: "external",
      },
    };
  }

  return {
    type: "TEXT",
    title: values.title,
    embedUrl: {
      url: values.embedUrl,
      embedType: "iframe",
    },
  };
};
