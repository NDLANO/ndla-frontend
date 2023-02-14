/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import groupBy from 'lodash/groupBy';
import { GQLMySubjectsSubjectFragmentFragment } from '../../graphqlTypes';

export const subjectLetters = [
  '#',
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
  'Æ',
  'Ø',
  'Å',
];

interface GroupedSubject {
  label: string;
  subjects: GQLMySubjectsSubjectFragmentFragment[];
}

export const groupSubjects = (
  subjects: GQLMySubjectsSubjectFragmentFragment[],
): GroupedSubject[] => {
  return Object.entries(
    groupBy(subjects, subject => {
      const firstChar = subject.name[0]?.toUpperCase();
      const isLetter = firstChar?.match(/[A-Z\WÆØÅ]+/);
      return isLetter ? firstChar : '#';
    }),
  )
    .map(group => ({ label: group[0], subjects: group[1] }))
    .sort((a, b) => (a.label > b.label ? 1 : -1));
};

export const filterSubjects = (
  allSubjects: GQLMySubjectsSubjectFragmentFragment[],
  status: string,
) => {
  const subjects = allSubjects.filter(
    subject => subject.metadata.customFields.forklaringsfag !== 'true',
  );
  if (status === 'all') {
    return subjects.filter(
      subject => subject.metadata.customFields.subjectCategory,
    );
  }
  return subjects.filter(
    subject => subject.metadata.customFields.subjectCategory === status,
  );
};
