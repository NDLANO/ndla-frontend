import groupBy from 'lodash/groupBy';
import { GQLMySubjectsSubjectFragmentFragment } from '../../graphqlTypes';

export const letters = [
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
  subjects: GQLMySubjectsSubjectFragmentFragment[],
  status: string,
) => {
  if (status === 'all') {
    return subjects;
  }
  return subjects.filter(
    subject => subject.metadata.customFields.subjectCategory === status,
  );
};
