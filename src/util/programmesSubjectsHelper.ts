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
import { LocaleType, SubjectType } from '../interfaces';

interface SubjectCategory {
  name: Record<LocaleType, string>;
  subjects: {
    longName: Record<LocaleType, string>;
    name: Record<LocaleType, string>;
    id: string;
    hideOnFrontPage?: boolean;
  }[];
}
interface ProgramSubjectBase {
  name: string;
  url: string;
  path: string;
}
interface ProgramSubjectType extends ProgramSubjectBase {
  label?: string;
}
type ProgramSubject = keyof ProgramSubjectType;

const sortBy = (
  arr: ProgramSubjectType[],
  sortByProp: ProgramSubject = 'name',
) =>
  arr.sort((a: ProgramSubjectType, b: ProgramSubjectType) => {
    if (a[sortByProp]! < b[sortByProp]!) return -1;
    if (a[sortByProp]! > b[sortByProp]!) return 1;
    return 0;
  });

export const createSubjectUrl = (subject: SubjectType) => {
  const baseUrl = `${toSubject(subject.id)}/`;
  return subject.topicId ? `${baseUrl}${removeUrn(subject.topicId)}/` : baseUrl;
};

export const getCategorizedSubjects = (locale: LocaleType) => {
  return subjectsCategories.map((category: SubjectCategory) => {
    const subjects = category.subjects
      .filter(subject => !subject.hideOnFrontPage)
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
    };
  });
  return sortBy(programmesData, 'label');
};
