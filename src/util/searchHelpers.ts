/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { TAXONOMY_CUSTOM_FIELD_SUBJECT_TYPE, TAXONOMY_CUSTOM_FIELD_SUBJECT_CATEGORY } from "../constants";
import { GQLSubjectInfoFragment } from "../graphqlTypes";

type SubjectType = Pick<GQLSubjectInfoFragment, "id" | "name" | "metadata" | "subjectpage" | "path">;

export const searchSubjects = <T extends SubjectType>(query?: string, subjects?: T[], subjectsFilter?: string[]) => {
  const trimmedQuery = query?.trim().toLowerCase();

  if (subjectsFilter?.length) {
    const filtered = subjects?.filter((subject) => subjectsFilter.includes(subject.id));
    return filtered;
  }
  if (!trimmedQuery || trimmedQuery?.length < 2) return subjects;

  const filtered = subjects?.filter(
    (subject) =>
      subject.metadata.customFields[TAXONOMY_CUSTOM_FIELD_SUBJECT_CATEGORY] !== undefined ||
      subject.metadata.customFields[TAXONOMY_CUSTOM_FIELD_SUBJECT_TYPE] !== undefined,
  );

  return filtered?.filter((subject) => subject.name.toLowerCase().includes(trimmedQuery));
};
