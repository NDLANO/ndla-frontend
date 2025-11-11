/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export const URN_ARTICLE = "urn:article:";
export const URN_LEARTNING_PATH = "urn:learningpath:";

export const isLearningPathResource = (contentUri: string | undefined): contentUri is string =>
  !!contentUri?.startsWith(URN_LEARTNING_PATH);

export const isArticleResource = (contentUri: string | undefined): contentUri is string =>
  !!contentUri?.startsWith(URN_ARTICLE) && contentUri.length > 12;

export const getArticleIdFromResource = (contentUri: string | undefined) => {
  return isArticleResource(contentUri) ? contentUri.replace(URN_ARTICLE, "") : undefined;
};

export const getLearningPathIdFromResource = (contentUri: string | undefined) => {
  return isLearningPathResource(contentUri) ? contentUri.replace(URN_LEARTNING_PATH, "") : undefined;
};
