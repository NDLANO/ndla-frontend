/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { subjectCategories } from "@ndla/ui";
import { TFunction } from "i18next";
import { TAXONOMY_CUSTOM_FIELD_SUBJECT_CATEGORY } from "../constants";
import { groupBy, sortBy } from "@ndla/util";

const createFilterTranslation = (t: TFunction, key: string, addTail = true) => {
  const label = addTail
    ? `${t(`subjectCategories.${key}`)} ${t("common.subject", {
        count: 2,
      }).toLowerCase()}`
    : t(`subjectCategories.${key}`);
  return label;
};

export const createFilters = (t: TFunction) => [
  {
    label: createFilterTranslation(t, subjectCategories.ACTIVE_SUBJECTS),
    value: subjectCategories.ACTIVE_SUBJECTS,
    subfilters: [
      {
        label: createFilterTranslation(t, subjectCategories.OTHER, false),
        value: subjectCategories.OTHER,
      },
      {
        label: createFilterTranslation(t, subjectCategories.BETA_SUBJECTS),
        value: subjectCategories.BETA_SUBJECTS,
      },
    ],
  },
  {
    label: createFilterTranslation(t, subjectCategories.ARCHIVE_SUBJECTS),
    value: subjectCategories.ARCHIVE_SUBJECTS,
    subfilters: [],
  },
];

interface BaseSubject {
  name: string;
  metadata: {
    customFields: any;
  };
}

const LETTER_REGEXP = /[A-Z\WÆØÅ]+/;

export const groupAndFilterSubjectsByCategory = <T extends BaseSubject>(
  filter: string,
  subFilters: string[] | undefined,
  subjects: T[],
): { label: string; subjects: T[] }[] => {
  const filtered = subjects.filter((subject) => {
    const fields = subject.metadata.customFields;
    if (subFilters?.length) {
      return subFilters.includes(fields[TAXONOMY_CUSTOM_FIELD_SUBJECT_CATEGORY]);
    }
    return fields[TAXONOMY_CUSTOM_FIELD_SUBJECT_CATEGORY] === filter;
  });

  const grouped = groupBy(filtered, (sub) => {
    const firstChar = sub.name[0]?.toUpperCase();
    return firstChar?.match(LETTER_REGEXP) ? firstChar : "#";
  });

  return sortBy(
    Object.entries(grouped).map((g) => ({ label: g[0], subjects: g[1] })),
    (g) => g.label,
  );
};
