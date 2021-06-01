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

const sortBy = (arr, sortByProp = 'name') =>
  arr.sort((a, b) => {
    if (a[sortByProp] < b[sortByProp]) return -1;
    if (a[sortByProp] > b[sortByProp]) return 1;
    return 0;
  });

export const createSubjectFilterUrl = subject => {
  let baseUrl = `${toSubject(subject.subjectId)}/`;
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
      return {
        name: subject.longName[locale],
        url: createSubjectFilterUrl(subject),
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
    return {
      label: program.name[locale],
      url: createProgrammeUrl(program, locale),
    };
  });
  return sortBy(programmesData, 'label');
};
