/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import config from "../../../config";
import { FormType, FormValues } from "./components/LearningpathStepForm";
import { GQLMyNdlaLearningpathStepFragment } from "../../../graphqlTypes";

export const sharedLearningpathLink = (id: number) => `${config.ndlaFrontendDomain}/learningpath/${id}`;

export const copyLearningpathSharingLink = (id: number) =>
  window.navigator.clipboard.writeText(sharedLearningpathLink(id));

export const LEARNINGPATH_SHARED = "UNLISTED";
export const LEARNINGPATH_PRIVATE = "PRIVATE";
export const LEARNINGPATH_READY_FOR_SHARING = "READY_FOR_SHARING";

export const getFormTypeFromStep = (step?: GQLMyNdlaLearningpathStepFragment) => {
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

export const formValues: (type?: FormType, step?: GQLMyNdlaLearningpathStepFragment) => Partial<FormValues> = (
  type?: FormType,
  step?: GQLMyNdlaLearningpathStepFragment,
) => ({
  type: type ?? "",
  title: step?.title ?? "",
  introduction: step?.introduction ?? "",
  embedUrl: step?.embedUrl?.url ?? "",
  shareable: !!step?.embedUrl?.url,
  description: step?.description ?? "<p></p>",
});

export const getValuesFromStep = (type: FormType, step?: GQLMyNdlaLearningpathStepFragment) => {
  const formType = getFormTypeFromStep(step);
  const isInitialType = formType === type;
  return formValues(formType, isInitialType ? step : undefined);
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

  return {
    type: "TEXT",
    title: values.title,
    embedUrl: {
      url: values.embedUrl,
      embedType: "iframe",
    },
  };
};
