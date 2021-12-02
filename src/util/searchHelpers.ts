import { TFunction } from 'i18next';
import { GQLFrontpageSearch, GQLSubject } from '../graphqlTypes';
import { LocaleType } from '../interfaces';
import { toSubject } from '../routeHelpers';
import config from '../config';

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
  subjects?: GQLSubject[],
) => {
  const trimmedQuery = query?.trim().toLowerCase();
  if (!trimmedQuery || trimmedQuery?.length < 2) {
    return [];
  }

  const foundInSubjects = subjects?.filter(subject =>
    subject.name.toLowerCase().includes(trimmedQuery),
  );

  return foundInSubjects?.map(subject => {
    return {
      id: subject.id,
      url: toSubject(subject.id),
      title: subject.name,
      img: subject.subjectpage?.banner?.desktopUrl,
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
