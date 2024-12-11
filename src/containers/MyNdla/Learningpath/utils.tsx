/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FormType, FormValues } from "./components/LearningpathStepForm";
import { GQLMyNdlaLearningpathStepFragment } from "../../../graphqlTypes";

export const getFormTypeFromStep = (step?: GQLMyNdlaLearningpathStepFragment) => {
  if (!step?.resource && !step?.oembed && !step?.embedUrl) {
    return "text";
  } else if (step?.resource || step.embedUrl?.url.includes("resource")) {
    return "resource";
  } else if (step?.embedUrl?.embedType === "external") {
    return "external";
  }
  return undefined;
};

const formValues: Record<FormType, (step?: GQLMyNdlaLearningpathStepFragment) => FormValues> = {
  external: (step) => ({
    type: "external",
    title: step?.title ?? "",
    introduction: step?.introduction ?? "",
    url: step?.embedUrl?.url ?? "",
    shareable: !!step?.embedUrl?.url,
  }),
  resource: (step) => ({
    type: "resource",
    title: step?.title ?? "",
    embedUrl: step?.embedUrl?.url ?? "",
  }),
  text: (step) => ({
    type: "text",
    title: step?.title ?? "",
    introduction: step?.introduction ?? "",
    description: step?.description ?? "",
  }),
  folder: (step) => ({
    type: "folder",
    title: step?.title ?? "",
    embedUrl: step?.embedUrl?.url ?? "",
  }),
};

export const getValuesFromStep = (type: FormType, step?: GQLMyNdlaLearningpathStepFragment) => {
  const formType = getFormTypeFromStep(step);
  const isInitialType = formType === type;
  return formValues[type](isInitialType ? step : undefined);
};
