/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { contributorTypes, contributorGroups, licenses } from "@ndla/licenses";
import { Author } from "../interfaces";

const LicenseMapping: Record<string, string> = {
  "navngivelse-ikkekommersiell-ingenbearbeidelse": licenses.CC_BY_NC_ND_4,
  "navngivelse-ikkekommersiell-delpåsammevilkår": licenses.CC_BY_NC_SA_4,
  "navngivelse-ikkekommersiell": licenses.CC_BY_NC_4,
  "navngivelse-ingenbearbeidelse": licenses.CC_BY_ND_4,
  "navngivelse-delpåsammevilkår": licenses.CC_BY_SA_4,
  navngivelse: licenses.CC_BY_4,
  offentligdomene: licenses.PD,
  publicdomaindedication: licenses.CC0,
  publicdomainmark: licenses.PD,
  "fristatus-erklæring": licenses.CC0,
  opphavsrett: licenses.COPYRIGHTED,
};

const contributorMapping: Record<string, string> = {
  Manus: "Manusforfatter",
  Musikk: "Komponist",
  Opphavsmann: "Opphaver",
};

export const getLicenseByNBTitle = (title: string) => {
  const key = title.replace(/\s/g, "").toLowerCase();
  return LicenseMapping[key] ?? title;
};

export const mapContributorType = (type: string) => {
  return contributorMapping[type] ?? type;
};

export const getContributorGroups = (licenseInfos: string[]) => {
  const parseContributorsString = (contributorString: string) => {
    const contributorFields = contributorString.split(/: */);
    if (contributorFields.length !== 2) return { type: "", name: contributorFields[0]! };
    const [type, name] = contributorFields;
    const contributorType = Object.keys(contributorTypes.nb!).find(
      (key) => contributorTypes.nb![key] === mapContributorType((type as string).trim()),
    );
    return { type: contributorType || "", name: name || "" };
  };

  const contributors = licenseInfos.map((val) => parseContributorsString(val));

  return contributors.reduce(
    (
      groups: {
        creators: Author[];
        processors: Author[];
        rightsholders: Author[];
      },
      contributor,
    ) => {
      const objectKeys = Object.keys(contributorGroups) as Array<keyof typeof contributorGroups>;
      const group = objectKeys.find((key) => {
        return contributorGroups[key].find((type) => type === contributor.type);
      });
      if (group) {
        groups[group] = groups[group].concat(contributor);
      } else {
        groups.creators = groups.creators.concat(contributor);
      }

      return groups;
    },
    {
      creators: [],
      processors: [],
      rightsholders: [],
    },
  );
};
