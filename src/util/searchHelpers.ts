/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { TFunction } from 'i18next';
import { GQLFrontpageSearch } from '../graphqlTypes';
import { LocaleType, SubjectType } from '../interfaces';
import {
  activeSubjects,
  archivedSubjects,
  betaSubjects,
} from '../data/subjects';
import { removeUrn } from '../routeHelpers';
import config from '../config';

const createSubjectPath = (subject: SubjectType) => {
  return `/${removeUrn(subject.id)}/`;
};

type CategoryTypes = 'common' | 'programme' | 'study';

type Categories = {
  [key in CategoryTypes]: string;
};

const categories: Categories = {
  common: 'Fellesfag',
  programme: 'Yrkesfag',
  study: 'Studiespesialiserende',
};

export const searchSubjects = (
  query?: string,
  locale: LocaleType = config.defaultLocale,
) => {
  const trimmedQuery = query?.trim().toLowerCase();
  if (!trimmedQuery || trimmedQuery?.length < 2) {
    return [];
  }

  const foundInSubjects = [
    ...activeSubjects,
    ...archivedSubjects,
    ...betaSubjects,
  ].filter(subject =>
    subject.longName[locale].toLowerCase().includes(trimmedQuery),
  );

  return foundInSubjects.map(subject => {
    return {
      id: subject.id,
      path: createSubjectPath(subject),
      subject: categories[subject.id.split('_')[0] as CategoryTypes],
      name: subject.longName[locale],
    };
  });
};

interface SearchResult {
  frontpageSearch?: GQLFrontpageSearch;
}

export const frontPageSearchSuggestion = (searchResult: SearchResult) => {
  if (!searchResult.frontpageSearch) {
    return;
  }

  const { learningResources, topicResources } = searchResult.frontpageSearch;

  if (!learningResources?.suggestions || !topicResources?.suggestions) {
    return;
  }

  const suggestions = learningResources.suggestions
    ?.concat(topicResources.suggestions)
    .map(s => s.suggestions?.[0]?.options?.[0])
    .filter(s => !!s)
    .sort((a, b) => b?.score! - a?.score!);
  return suggestions[0]?.text;
};

export const mapSearchToFrontPageStructure = (
  data: SearchResult,
  t: TFunction,
  query: string,
  locale: LocaleType,
) => {
  const subjectHits = searchSubjects(query, locale);
  const subjects = {
    title: t('searchPage.label.subjects'),
    contentType: 'results-frontpage',
    resources: subjectHits,
  };

  if (!data.frontpageSearch && subjectHits.length === 0) {
    return [];
  }
  if (!data.frontpageSearch) {
    return [subjects];
  }

  const {
    frontpageSearch: { learningResources, topicResources },
  } = data;

  const topics = {
    title: `${t('subjectPage.tabs.topics')}:`,
    contentType: 'results-frontpage',
    resources: topicResources?.results,
    totalCount: topicResources?.totalCount,
  };
  const resource = {
    title: `${t('resource.label')}:`,
    contentType: 'results-frontpage',
    resources: learningResources?.results,
    totalCount: learningResources?.totalCount,
  };

  const subjectsToAdd = subjectHits.length ? [subjects] : [];
  const topicsToAdd = topics.totalCount ? [topics] : [];
  const resourceToAdd = resource.totalCount ? [resource] : [];
  return [...subjectsToAdd, ...topicsToAdd, ...resourceToAdd];
};
