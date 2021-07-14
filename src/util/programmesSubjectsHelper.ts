/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { toProgramme, toSubject } from '../routeHelpers';
import { subjectsCategories } from '../data/subjects';
import { programmes } from '../data/programmes';
import { removeUrn } from '../routeHelpers';
import { LocaleType, ProgramType, SubjectType } from '../interfaces';

interface ProgramSubjectType {
  name: string;
  url: string;
  path: string;
  label?: string;
  [key: string]: string | undefined;
}

const sortBy = (arr?: (ProgramSubjectType | null)[], sortByProp = 'name') =>
  arr?.sort((a: ProgramSubjectType | null, b: ProgramSubjectType | null) => {
    if (a![sortByProp]! < b![sortByProp]!) return -1;
    if (a![sortByProp]! > b![sortByProp]!) return 1;
    return 0;
  });

export const createSubjectUrl = (subject: SubjectType) => {
  let baseUrl = `${toSubject(subject.id)}/`;
  if (subject.topicId) {
    baseUrl = `${baseUrl}${removeUrn(subject.topicId)}/`;
  }
  return baseUrl;
};

const createProgrammeUrl = (program: ProgramType, locale: LocaleType) => {
  return toProgramme(program.url[locale]);
};

export const getCategorizedSubjects = (locale: LocaleType) => {
  return subjectsCategories.map(category => {
    const subjects = category.subjects.map(subject => {
      // @ts-ignore
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

export const getProgrammes = (locale: LocaleType) => {
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
