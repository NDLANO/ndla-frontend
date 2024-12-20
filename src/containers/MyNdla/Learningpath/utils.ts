/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import config from "../../../config";
import { GQLMyNdlaLearningpathStepFragment } from "../../../graphqlTypes";
import { FormValuesMap, FormValues, FormKeys } from "./types";

export const sharedLearningpathLink = (id: number) => `${config.ndlaFrontendDomain}/learningpath/${id}`;

export const copyLearningpathSharingLink = (id: number) =>
  window.navigator.clipboard.writeText(sharedLearningpathLink(id));

export const LEARNINGPATH_SHARED = "UNLISTED";
export const LEARNINGPATH_PRIVATE = "PRIVATE";
export const LEARNINGPATH_READY_FOR_SHARING = "READY_FOR_SHARING";

export const getFormTypeFromStep = (step?: GQLMyNdlaLearningpathStepFragment): FormKeys | undefined => {
  if (!step?.resource && !step?.oembed && !step?.embedUrl) {
    return "text";
  }

  if (step?.resource || step.embedUrl?.url.includes("resource")) {
    return "resource";
  }

  if (step?.embedUrl?.embedType === "external") {
    return "external";
  }
  return undefined;
};

export const toFormValues = <T extends FormKeys>(
  type: T,
  step?: GQLMyNdlaLearningpathStepFragment,
): FormValuesMap[T] => {
  const baseValues = { title: step?.title ?? "" };
  return (
    {
      text: {
        ...baseValues,
        type: "text",
        introduction: step?.introduction ?? "",
        description: step?.description ?? "",
      },
      resource: { ...baseValues, type: "resource", embedUrl: step?.embedUrl?.url ?? "" },
      external: {
        ...baseValues,
        type: "external",
        url: step?.embedUrl?.url ?? "",
        introduction: step?.introduction ?? "",
        shareable: !!step?.embedUrl?.url,
      },
      folder: { ...baseValues, type: "folder" },
    } as const
  )[type];
};

export const formValuesToGQLInput = (values: FormValues) => {
  if (values.type === "text") {
    return {
      type: "TEXT",
      title: values.title,
      introduction: values.introduction,
      description: values.description,
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
  if (values.type === "folder") {
    // TODO: Implement once folder form is added
    return { type: "TEXT", title: values.title };
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
