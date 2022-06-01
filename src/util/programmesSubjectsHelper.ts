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
import { LocaleType, SubjectCategory, SubjectType } from '../interfaces';

interface ProgramSubjectBase {
  name: string;
  url: string;
  path: string;
}
export interface ProgramSubjectType extends ProgramSubjectBase {
  label?: string;
}

const sortBy = <T extends { name: string }>(
  arr: T[],
  sortByProp: keyof T = 'name',
) =>
  arr.sort((a: T, b: T) => {
    if (a[sortByProp] < b[sortByProp]) return -1;
    if (a[sortByProp] > b[sortByProp]) return 1;
    return 0;
  });

export const createSubjectUrl = (subject: SubjectType) => {
  const baseUrl = `${toSubject(subject.id)}/`;
  return subject.topicId ? `${baseUrl}${removeUrn(subject.topicId)}/` : baseUrl;
};

export const getCategorizedSubjects = (locale: LocaleType) => {
  return subjectsCategories.map((category: SubjectCategory) => {
    const subjects = category.subjects
      .filter(subject => !subject.hideOnFrontpage)
      .map(subject => {
        const path = createSubjectUrl(subject);
        return {
          name: subject.longName[locale],
          url: path,
          path,
        };
      });

    return {
      name: category.name[locale],
      subjects: sortBy(subjects),
      visible: category.visible,
    };
  });
};

export const getProgrammes = (locale: LocaleType) => {
  const programmesData = programmes.map(program => {
    const path = toProgramme(program.url[locale]);
    return {
      label: program.name[locale],
      name: program.name[locale],
      url: path,
      path,
      grades: program.grades,
    };
  });
  return sortBy(programmesData, 'label');
};
