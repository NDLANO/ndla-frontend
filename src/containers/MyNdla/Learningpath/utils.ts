/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import config from "../../../config";
import { GQLMyNdlaLearningpathStepFragment } from "../../../graphqlTypes";
import { deserializeToRichText, serializeFromRichText } from "../../../components/RichTextEditor/richTextSerialization";
import { FormValues } from "./types";
import { unreachable } from "../../../util/guards";

export const sharedLearningpathLink = (id: number) => `${config.ndlaFrontendDomain}/learningpaths/${id}`;

export const copyLearningpathSharingLink = (id: number) =>
  window.navigator.clipboard.writeText(sharedLearningpathLink(id));

export const LEARNINGPATH_SHARED = "UNLISTED";
export const LEARNINGPATH_PRIVATE = "PRIVATE";
export const LEARNINGPATH_READY_FOR_SHARING = "READY_FOR_SHARING";

export const getFormTypeFromStep = (step?: GQLMyNdlaLearningpathStepFragment): FormValues["type"] => {
  if (!step?.resource && !step?.oembed && !step?.embedUrl) return "text";
  if (step?.resource || step.embedUrl?.url.includes("resource")) return "resource";
  if (step?.embedUrl?.embedType === "external") return "external";
  return "text";
};

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

export const learningpathId = (id: number) => `learningpath-${id}`;

export const learningpathStepId = (id: number) => `learningpathstep-${id}`;
