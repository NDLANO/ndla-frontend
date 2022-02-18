import { constants } from '@ndla/ui';
import { TAXONOMY_CUSTOM_FIELD_SUBJECT_CATEGORY } from '../constants';
import { GQLSubjectInfoFragment } from '../graphqlTypes';

export const multidisciplinaryTopics = [
  {
    name: {
      nb: 'Folkehelse og livsmestring',
      nn: 'Folkehelse og livsmestring',
      en: 'Folkehelse og livsmestring',
    },
    topicId: 'urn:topic:3cdf9349-4593-498c-a899-9310133a4788',
    id: 'urn:topic:3cdf9349-4593-498c-a899-9310133a4788',
  },
  {
    name: {
      nb: 'Demokrati og medborgerskap',
      nn: 'Demokrati og medborgerskap',
      en: 'Demokrati og medborgerskap',
    },
    topicId: 'urn:topic:077a5e01-6bb8-4c0b-b1d4-94b683d91803',
    id: 'urn:topic:077a5e01-6bb8-4c0b-b1d4-94b683d91803',
  },
  {
    name: {
      nb: 'Bærekraftig utvikling',
      nn: 'Bærekraftig utvikling',
      en: 'Bærekraftig utvikling',
    },
    topicId: 'urn:topic:a2f5aaa0-ab52-49d5-aabf-e7ffeac47fa2',
    id: 'urn:topic:a2f5aaa0-ab52-49d5-aabf-e7ffeac47fa2',
  },
];

// TODO: Fix messy mapping of subjects to make path absolute.
export const getSubjectsCategories = (
  subjects: GQLSubjectInfoFragment[] = [],
) => [
  {
    type: constants.subjectCategories.ACTIVE_SUBJECTS,
    subjects: subjects
      .filter(
        s =>
          s.metadata?.customFields?.[TAXONOMY_CUSTOM_FIELD_SUBJECT_CATEGORY] ===
          constants.subjectCategories.ACTIVE_SUBJECTS,
      )
      .map(s => {
        return {
          ...s,
          path: s.path ?? '',
        };
      }),
  },
  {
    type: constants.subjectCategories.ARCHIVE_SUBJECTS,
    subjects: subjects
      .filter(
        s =>
          s.metadata?.customFields?.[TAXONOMY_CUSTOM_FIELD_SUBJECT_CATEGORY] ===
          constants.subjectCategories.ARCHIVE_SUBJECTS,
      )
      .map(s => {
        return {
          ...s,
          path: s.path ?? '',
        };
      }),
    visible: true,
  },
  {
    type: constants.subjectCategories.BETA_SUBJECTS,
    subjects: subjects
      .filter(
        s =>
          s.metadata?.customFields?.[TAXONOMY_CUSTOM_FIELD_SUBJECT_CATEGORY] ===
          constants.subjectCategories.BETA_SUBJECTS,
      )
      .map(s => {
        return {
          ...s,
          path: s.path ?? '',
        };
      }),
    visible: true,
  },
];
