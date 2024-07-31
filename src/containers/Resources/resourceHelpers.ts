/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import config from "../../config";
import { GQLWithContent } from "../../graphqlTypes";

export const URN_ARTICLE = "urn:article:";
export const URN_LEARTNING_PATH = "urn:learningpath:";

export const hasContentUri = (content: Pick<GQLWithContent, "contentUri">) => (content && content.contentUri) || false;

export const isLearningPathResource = (resource: Pick<GQLWithContent, "contentUri">) =>
  hasContentUri(resource) && resource!.contentUri!.startsWith(URN_LEARTNING_PATH);

export const isArticleResource = (resource: Pick<GQLWithContent, "contentUri">) =>
  hasContentUri(resource) && resource!.contentUri!.startsWith(URN_ARTICLE) && resource!.contentUri!.length > 12;

export const getArticleIdFromResource = (resource: Pick<GQLWithContent, "contentUri">) => {
  if (isArticleResource(resource)) {
    return resource!.contentUri!.replace(URN_ARTICLE, "");
  }
  return undefined;
};

export const getLearningPathIdFromResource = (resource: Pick<GQLWithContent, "contentUri">) => {
  if (isLearningPathResource(resource)) {
    return resource!.contentUri!.replace(URN_LEARTNING_PATH, "");
  }
  return undefined;
};

export function getLearningPathUrlFromResource(resource: Pick<GQLWithContent, "contentUri">, languagePrefix?: string) {
  return `${config.learningPathDomain}${
    languagePrefix ? `/${languagePrefix}` : ""
  }/learningpaths/${getLearningPathIdFromResource(resource)}/first-step`;
}
