/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { subjectCategories, subjectTypes } from "@ndla/ui";
import { groupBy, sortBy } from "@ndla/util";
import { TFunction } from "i18next";
import { TAXONOMY_CUSTOM_FIELD_SUBJECT_CATEGORY, TAXONOMY_CUSTOM_FIELD_SUBJECT_TYPE } from "../constants";

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

const ACTIVE_CATEGORIES = [subjectCategories.ACTIVE_SUBJECTS, subjectCategories.BETA_SUBJECTS, subjectCategories.OTHER];
const ACTIVE_SUBJECT_TYPES = [subjectTypes.BETA_SUBJECT, subjectTypes.RESOURCE_COLLECTION, subjectTypes.SUBJECT];

const LETTER_REGEXP = /[A-Z\WÆØÅ]+/;

export const groupAndFilterSubjectsByCategory = <T extends BaseSubject>(
  filter: string,
  subFilters: string[] | undefined,
  subjects: T[],
): { label: string; subjects: T[] }[] => {
  const filtered = subjects.filter((subject) => {
    const fields = subject.metadata.customFields;
    if (!fields[TAXONOMY_CUSTOM_FIELD_SUBJECT_CATEGORY] && !fields[TAXONOMY_CUSTOM_FIELD_SUBJECT_TYPE]) return false;
    if (subFilters?.length) {
      return subFilters.some((subFilter) => {
        if (subFilter === subjectCategories.OTHER) {
          return fields[TAXONOMY_CUSTOM_FIELD_SUBJECT_CATEGORY] === subjectCategories.OTHER;
        } else if (subFilter === subjectCategories.BETA_SUBJECTS) {
          return (
            fields[TAXONOMY_CUSTOM_FIELD_SUBJECT_CATEGORY] === subjectCategories.BETA_SUBJECTS ||
            fields[TAXONOMY_CUSTOM_FIELD_SUBJECT_TYPE] === subjectTypes.BETA_SUBJECT
          );
        } else return false;
      });
    }
    if (filter === subjectCategories.ACTIVE_SUBJECTS) {
      return (
        ACTIVE_CATEGORIES.includes(fields[TAXONOMY_CUSTOM_FIELD_SUBJECT_CATEGORY]) ||
        ACTIVE_SUBJECT_TYPES.includes(fields[TAXONOMY_CUSTOM_FIELD_SUBJECT_TYPE])
      );
    } else if (filter === subjectCategories.ARCHIVE_SUBJECTS) {
      return fields[TAXONOMY_CUSTOM_FIELD_SUBJECT_CATEGORY] === subjectCategories.ARCHIVE_SUBJECTS;
    } else return false;
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
