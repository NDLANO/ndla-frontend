import {
  commonSubjects,
  programmeSubjects,
  studySpecializationSubjects,
} from '../data/subjects';
import { removeUrn } from '../routeHelpers';

const createSubjectFilterPath = subject => {
  const baseUrl = `/${removeUrn(subject.subjectId)}/`;
  if (subject.filters) {
    const filterIds = subject.filters.join(',');
    return `${baseUrl}?filters=${filterIds}`;
  }
  return baseUrl;
};

const categories = {
  common: 'Fellesfag',
  programme: 'Yrkesfag',
  study: 'Studiespesialiserende',
};

export const searchSubjects = query => {
  if (!query) {
    return [];
  }
  query = query.trim().toLowerCase();

  const foundInSubjects = [
    ...commonSubjects,
    ...programmeSubjects,
    ...studySpecializationSubjects,
  ].filter(subject => subject.longName.nb.toLowerCase().includes(query));

  return foundInSubjects.map(subject => ({
    id: subject.id,
    path: createSubjectFilterPath(subject),
    subject: categories[subject.id.split('_')[0]],
    name: subject.longName.nb,
  }));
};

export const mapSearchToFrontPageStructure = (data, t, query) => {
  const subjectHits = searchSubjects(query);
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
    resources: topicResources.results,
    totalCount: topicResources.totalCount,
  };
  const resource = {
    title: `${t('resource.label')}:`,
    contentType: 'results-frontpage',
    resources: learningResources.results,
    totalCount: learningResources.totalCount,
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
