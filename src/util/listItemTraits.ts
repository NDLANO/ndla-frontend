/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { sortBy } from "@ndla/util";
import { RELEVANCE_SUPPLEMENTARY, resourceTypeSortOrder } from "../constants";
import { useMemo } from "react";
import config from "../config";

interface ListItemTraitParams {
  /** Article traits */
  traits?: string[];
  /** The actual resource types attached to a node. Prefer resourceType over passing in additional stuff here. */
  resourceTypes?: { id: string; name: string }[];
  relevanceId?: string;
  /** Useful for items that do not support resource types (subjects, topics, images etc). Omitted if resourceTypes are defined. */
  resourceType?: string;
  /** Fallback for old resource types. TODO: Remove with allResourceTypesEnabled flag */
  contentType?: string;
}

export const getListItemTraits = (params: ListItemTraitParams, t: (key: string) => string) => {
  const traits: string[] = [];
  if (!config.allResourceTypesEnabled) {
    if (params.contentType) {
      traits.push(t(`contentTypes.${params.contentType}`));
    }
    return traits;
  }

  if (params.resourceType && !params.resourceTypes?.length) {
    traits.push(t(`contentTypes.${params.resourceType}`));
  }

  if (params.resourceTypes?.length) {
    const sorted = sortBy(
      params.resourceTypes,
      (type) => resourceTypeSortOrder[type.id] ?? resourceTypeSortOrder.default,
    );
    traits.push(...sorted.map((rt) => rt.name));
  }

  if (params.traits?.length) {
    const translated = params.traits.map((trait) => t(`searchPage.traits.${trait}`));
    traits.push(...translated);
  }

  if (params.relevanceId === RELEVANCE_SUPPLEMENTARY) {
    traits.push(t("resource.tooltipAdditionalTopic"));
  }

  return traits;
};

export const useListItemTraits = (params: ListItemTraitParams) => {
  const { t } = useTranslation();

  const traits = useMemo(() => getListItemTraits(params, t), [t, params]);

  return traits;
};
