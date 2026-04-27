/**
 * Copyright (c) 2026-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

interface SearchParamsProps {
  subjectIds?: string[];
  query?: string;
  traits?: string[];
  type?: string;
}
export const toSearchParams = ({ subjectIds, query, traits, type }: SearchParamsProps) => {
  const params = new URLSearchParams();
  if (query?.length) {
    params.set("query", encodeURIComponent(query));
  }
  if (subjectIds?.length) {
    params.set("subjects", subjectIds.map((id) => id.replace("urn:subject:", "")).join(","));
  }
  if (traits?.length) {
    params.set("traits", traits.join(","));
  }
  if (type) {
    params.set("type", type);
  }
  return params;
};
