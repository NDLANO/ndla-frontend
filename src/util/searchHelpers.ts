/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { TAXONOMY_CUSTOM_FIELD_SUBJECT_TYPE, TAXONOMY_CUSTOM_FIELD_SUBJECT_CATEGORY } from "../constants";
import { GQLSubjectInfoFragment } from "../graphqlTypes";
import { toSubject } from "../routeHelpers";

export const searchSubjects = <
  T extends Pick<GQLSubjectInfoFragment, "id" | "name" | "metadata" | "subjectpage" | "path">,
>(
  query?: string,
  subjects?: T[],
) => {
  const trimmedQuery = query?.trim().toLowerCase();
  if (!trimmedQuery || trimmedQuery?.length < 2) {
    return [];
  }

  const filtered = subjects?.filter(
    (subject) =>
      subject.metadata.customFields[TAXONOMY_CUSTOM_FIELD_SUBJECT_CATEGORY] !== undefined ||
      subject.metadata.customFields[TAXONOMY_CUSTOM_FIELD_SUBJECT_TYPE] !== undefined,
  );

  const foundInSubjects = filtered?.filter((subject) => subject.name.toLowerCase().includes(trimmedQuery));

  return foundInSubjects?.map((subject) => {
    return {
      ...subject,
      id: subject.id,
      url: toSubject(subject.id),
      title: subject.name,
      img: { url: subject.subjectpage?.banner?.desktopUrl ?? "" },
    };
  });
};
