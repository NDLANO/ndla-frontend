import { FRONTPAGE_CATEGORIES } from '../constants';
import {
  findCategoryByName,
  findMatchingFrontpageFilter,
} from '../containers/WelcomePage/FrontpageSubjects';
import { removeUrn } from '../routeHelpers';

const createSubjectFilterPath = (subject, filter) => {
  const baseUrl = `/${removeUrn(subject.id)}/`;
  if (filter) {
    const filterIds = filter.map(f => f.id).join(',');
    return `${baseUrl}?filters=${filterIds}`;
  }
  return baseUrl;
};

export const searchSubjects = (query, locale, categoriesFromApi) => {
  const allOfThem = FRONTPAGE_CATEGORIES.categories.reduce(
    (accumulated, category) => {
      if (!query) {
        return [];
      }

      const subjectsFromApi = findCategoryByName(
        categoriesFromApi,
        category.name,
      );

      query = query.trim().toLowerCase();
      const foundInSubjects = category.subjects.filter(subject =>
        subject.name.toLowerCase().includes(query),
      );

      return [
        ...accumulated,
        ...foundInSubjects.map(subject => {
          const filter = findMatchingFrontpageFilter(subjectsFromApi, subject);
          const path = subject.id
            ? createSubjectFilterPath(subject, filter)
            : `${locale ? `/${locale}` : ''}/node/${subject.nodeId}/`;
          return {
            id: subject.id,
            path: path,
            subject: `${category.name
              .charAt(0)
              .toUpperCase()}${category.name.slice(1)}:`,
            name: subject.name,
          };
        }),
      ];
    },
    [],
  );

  return allOfThem;
};

export const mapSearchToFrontPageStructure = (
  data,
  t,
  query,
  locale,
  categoriesFromApi,
) => {
  const subjectHits = searchSubjects(query, locale, categoriesFromApi);
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
