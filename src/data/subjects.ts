import { constants } from '@ndla/ui';
import { TFunction } from 'react-i18next';
import {
  TAXONOMY_CUSTOM_FIELD_SUBJECT_CATEGORY,
  TAXONOMY_CUSTOM_FIELD_SUBJECT_TYPE,
} from '../constants';
import { GQLSubjectInfoFragment } from '../graphqlTypes';

export const multidisciplinaryTopics = [
  {
    name: {
      nb: 'Folkehelse og livsmestring',
      nn: 'Folkehelse og livsmeistring',
      en: 'Public health and life management',
    },
    id: 'urn:topic:3cdf9349-4593-498c-a899-9310133a4788',
  },
  {
    name: {
      nb: 'Demokrati og medborgerskap',
      nn: 'Demokrati og medborgarskap',
      en: 'Democracy and citizenship',
    },
    id: 'urn:topic:077a5e01-6bb8-4c0b-b1d4-94b683d91803',
  },
  {
    name: {
      nb: 'Bærekraftig utvikling',
      nn: 'Berekraftig utvikling',
      en: 'Sustainable development',
    },
    id: 'urn:topic:a2f5aaa0-ab52-49d5-aabf-e7ffeac47fa2',
  },
];

const filterSubjects = (
  subjects: GQLSubjectInfoFragment[],
  customField: string,
  category: any,
  message?: string,
) => {
  const filtered = subjects.filter(
    s => s.metadata?.customFields?.[customField] === category,
  );

  return {
    type: category,
    subjects: filtered.map(s => {
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
    t('messageBoxInfo.frontPageBeta'),
  );
  const other = filterSubjects(
    subjects,
    TAXONOMY_CUSTOM_FIELD_SUBJECT_CATEGORY,
    constants.subjectCategories.OTHER,
  );

  return [active, archived, beta, other];
};
