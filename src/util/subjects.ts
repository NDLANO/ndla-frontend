/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { TFunction } from 'i18next';
import { constants } from '@ndla/ui';
import { TAXONOMY_CUSTOM_FIELD_SUBJECT_CATEGORY } from '../constants';
import { GQLSubjectInfoFragment } from '../graphqlTypes';

const filterSubjects = (
  subjects: GQLSubjectInfoFragment[],
  customField: string,
  category: any,
  message?: string,
) => {
  const filtered = subjects.filter(
    (s) => s.metadata?.customFields?.[customField] === category,
  );

  return {
    type: category,
    subjects: filtered.map((s) => {
      return {
        ...s,
        path: s.path ?? '',
      };
    }),
    visible: filtered.length > 0,
    message,
  };
};

// TODO: Fix messy mapping of subjects to make path absolute.
export const getSubjectsCategories = (
  t: TFunction,
  subjects: GQLSubjectInfoFragment[] = [],
) => {
  const active = filterSubjects(
    subjects,
    TAXONOMY_CUSTOM_FIELD_SUBJECT_CATEGORY,
    constants.subjectCategories.ACTIVE_SUBJECTS,
  );
  const archived = filterSubjects(
    subjects,
    TAXONOMY_CUSTOM_FIELD_SUBJECT_CATEGORY,
    constants.subjectCategories.ARCHIVE_SUBJECTS,
    t('messageBoxInfo.frontPageExpired'),
  );
  const beta = filterSubjects(
    subjects,
    TAXONOMY_CUSTOM_FIELD_SUBJECT_CATEGORY,
    constants.subjectCategories.BETA_SUBJECTS,
  );
  const other = filterSubjects(
    subjects,
    TAXONOMY_CUSTOM_FIELD_SUBJECT_CATEGORY,
    constants.subjectCategories.OTHER,
  );

  return [active, archived, beta, other];
};
