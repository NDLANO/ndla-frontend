/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { licenses, metaTypes } from "@ndla/licenses";
import { TFunction } from "i18next";
import { GQLConceptCopyright, GQLContributor, GQLLicenseListCopyrightFragment } from "../../graphqlTypes";

export const downloadUrl = (src: string) => {
  const url = new URL(src);
  url.searchParams.set("download", "true");
  return url.toString();
};

export const isCopyrighted = (license?: string) => license === licenses.COPYRIGHTED;

export function mkContributorString(contributors: GQLContributor[], ignoreType: string, t: TFunction) {
  return contributors
    .map((contributor) => {
      const type = contributor.type.toLowerCase();
      if (type === ignoreType) {
        return contributor.name;
      }
      const translatedType = t(type);
      return `${translatedType} ${contributor.name}`;
    })
    .join(", ");
}

export function getGroupedContributorDescriptionList(
  copyright: GQLLicenseListCopyrightFragment | GQLConceptCopyright | undefined,
  t: TFunction,
) {
  return [
    {
      label: t("originator"),
      description: mkContributorString(copyright?.creators ?? [], "originator", t),
      metaType: metaTypes.author,
    },
    {
      label: t("rightsholder"),
      description: mkContributorString(copyright?.rightsholders ?? [], "rightsholder", t),
      metaType: metaTypes.copyrightHolder,
    },
    {
      label: t("processor"),
      description: mkContributorString(copyright?.processors ?? [], "processor", t),
      metaType: metaTypes.contributor,
    },
  ].filter((item) => item.description !== "");
}
