/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { constants } from '@ndla/ui';
import { toProgramme, toSubject } from '../routeHelpers';
import { subjectsCategories } from '../data/subjects';
import { programmes } from '../data/programmes';
import { removeUrn } from '../routeHelpers';

const sortBy = (arr, sortByProp = 'name') =>
  arr.sort((a, b) => {
    if (a[sortByProp] < b[sortByProp]) return -1;
    if (a[sortByProp] > b[sortByProp]) return 1;
    return 0;
  });

export const createSubjectUrl = subject => {
  let baseUrl = `${toSubject(subject.id)}/`;
  if (subject.topicId) {
    baseUrl = `${baseUrl}${removeUrn(subject.topicId)}/`;
  }
  return baseUrl;
};

const createProgrammeUrl = (program, locale) => {
  return toProgramme(program.url[locale]);
};

export const getCategorizedSubjects = locale => {
  return subjectsCategories.map(category => {
    const subjects = category.subjects.map(subject => {
      if (subject.hideOnFrontpage) {
        return null;
      }
      const path = createSubjectUrl(subject);
      return {
        name: subject.longName[locale],
        url: path,
        path,
      };
    });

    return {
      name: category.name[locale],
      subjects: sortBy(subjects.filter(Boolean)),
    };
  });
};

export const getProgrammes = locale => {
  const programmesData = programmes.map(program => {
    const path = createProgrammeUrl(program, locale);
    return {
      label: program.name[locale],
      name: program.name[locale],
      url: path,
      path,
    };
  });
  return sortBy(programmesData, 'label');
};

export const getSubjectsCategories = subjects => [
  {
    type: constants.subjectCategories.COMMON_SUBJECTS,
    subjects: subjects.filter(
      s =>
        s.metadata.customFields['subjectCategory'] ===
        constants.subjectCategories.COMMON_SUBJECTS,
    ),
  },
  {
    type: constants.subjectCategories.PROGRAMME_SUBJECTS,
    subjects: subjects.filter(
      s =>
        s.metadata.customFields['subjectCategory'] ===
        constants.subjectCategories.PROGRAMME_SUBJECTS,
    ),
  },
  {
    type: constants.subjectCategories.SPECIALIZED_SUBJECTS,
    subjects: subjects.filter(
      s =>
        s.metadata.customFields['subjectCategory'] ===
        constants.subjectCategories.SPECIALIZED_SUBJECTS,
    ),
  },
  {
    type: constants.subjectCategories.ARCHIVE_SUBJECTS,
    subjects: subjects.filter(
      s =>
        s.metadata.customFields['subjectCategory'] ===
        constants.subjectCategories.ARCHIVE_SUBJECTS,
    ),
  },
  {
    type: constants.subjectCategories.BETA_SUBJECTS,
    subjects: subjects.filter(
      s =>
        s.metadata.customFields['subjectCategory'] ===
        constants.subjectCategories.BETA_SUBJECTS,
    ),
  },
];
