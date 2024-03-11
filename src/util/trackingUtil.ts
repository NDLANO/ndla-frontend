/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { GQLArticle, GQLLearningpathStep, GQLMyNdlaPersonalDataFragmentFragment } from "../graphqlTypes";

type DimensionKeys = "10" | "13" | "14" | "16" | "17" | "18" | "19" | "20";
type DimensionType = Record<DimensionKeys, string | number | undefined>;

export const getDimensionsCodes = {
  "10": "CustDimKjerneelement",
  "13": "CustDimStiLengde",
  "14": "CustDimStiSteg",
  "16": "CustDimFylke",
  "17": "CustDimSkule",
  "18": "CustDimRolle",
  "19": "CustDimFilter",
  "20": "CustDimKompetansemaal",
};

export const convertToGaOrGtmDimension = (dimensions: DimensionType): Record<string | number, any> => {
  return Object.keys(dimensions).reduce((prev, curr) => {
    const key = curr as DimensionKeys;
    return {
      ...prev,
      [getDimensionsCodes[key]]: dimensions[key],
    };
  }, {});
};

const getGrepCodeOfType = (pattern: string, grepCodes?: string[]) =>
  grepCodes?.filter((code) => code?.startsWith(pattern))?.join("|") || undefined;

type RequiredLearningpath = {
  learningsteps?: any[];
};

interface Props {
  article?: Pick<GQLArticle, "title" | "grepCodes" | "copyright">;
  learningpath?: RequiredLearningpath;
  learningstep?: Pick<GQLLearningpathStep, "seqNo">;
  filter?: string;
  user?: GQLMyNdlaPersonalDataFragmentFragment;
}

export const getAllDimensions = ({ article, learningpath, learningstep, filter, user }: Props) => {
  const dimensions: DimensionType = {
    "10": getGrepCodeOfType("KE", article?.grepCodes),
    "13": learningpath?.learningsteps?.length,
    "14": learningstep ? learningstep.seqNo + 1 : undefined,
    "16": user?.organization,
    // This is disabled for now.
    // "17": user?.groups.find((g) => g.isPrimarySchool)?.displayName,
    "17": undefined,
    "18": user?.role,
    "19": filter,
    "20": getGrepCodeOfType("KM", article?.grepCodes),
  };

  return convertToGaOrGtmDimension(dimensions);
};
