import { GQLFrontpageSearch, GQLSubject } from '../graphqlTypes';
import { LocaleType } from '../interfaces';
import {
  archivedSubjects,
  betaSubjects,
  commonSubjects,
  programmeSubjects,
  studySpecializationSubjects,
} from '../data/subjects';
import { removeUrn } from '../routeHelpers';

const createSubjectPath = (subject: GQLSubject) => {
  return `/${removeUrn(subject.id)}/`;
};

type Categories = {
  [key in 'common' | 'programme' | 'study']: string;
}; 

const categories: Categories = {
  common: 'Fellesfag',
  programme: 'Yrkesfag',
  study: 'Studiespesialiserende',
};

export const searchSubjects = (query: string, locale: LocaleType = 'nb' ) => {
  query = query?.trim().toLowerCase();
  if (!query || query.length < 2) {
    return [];
  }

  const foundInSubjects = [
    ...archivedSubjects,
    ...betaSubjects,
    ...commonSubjects,
    ...programmeSubjects,
    ...studySpecializationSubjects,
  ].filter(subject => subject.longName[locale].toLowerCase().includes(query));

  return foundInSubjects.map(subject => ({
    id: subject.id,
    path: createSubjectPath(subject),
    subject: categories[subject.id.split('_')[0] as 'common' | 'programme' | 'study'],
    name: subject.longName[locale],
  }));
};

interface searchResult {
  frontpageSearch: GQLFrontpageSearch;
}

export const frontPageSearchSuggestion = (searchResult: searchResult ) => {
  if (!searchResult.frontpageSearch) {
    return;
  }

  const {
    frontpageSearch: { learningResources, topicResources },
  } = searchResult;

  const suggestions = learningResources!.suggestions!
    .concat(topicResources?.suggestions!)
    .map(s => s?.suggestions?.[0]?.options?.[0])
    .filter(s => !!s)
    .sort((a, b) => b?.score! - a?.score!);
  return suggestions[0]?.text;
};

export const mapSearchToFrontPageStructure = (data: searchResult, t: (arg0: string) => any, query: string, locale: LocaleType) => {
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

  const returnArray = [];
  // add groups into return array if there are any resources
  if (subjectHits.length) {
    returnArray.push(subjects);
  }
  if (topics.totalCount) {
    returnArray.push(topics);
  }
  if (resource.totalCount) {
    returnArray.push(resource);
  }
  return returnArray;
};
