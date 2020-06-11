import { FRONTPAGE_CATEGORIES } from '../constants';
import { removeUrn } from '../routeHelpers';

const createSubjectFilterPath = subject => {
  const baseUrl = `/${removeUrn(subject.id)}/`;
  if (subject.filters) {
    const filterIds = subject.filters.join(',');
    return `${baseUrl}?filters=${filterIds}`;
  }
  return baseUrl;
};

export const searchSubjects = query => {
  const allOfThem = FRONTPAGE_CATEGORIES.categories.reduce(
    (accumulated, category) => {
      if (!query) {
        return [];
      }

      query = query.trim().toLowerCase();
      const foundInSubjects = category.subjects.filter(subject =>
        subject.name.toLowerCase().includes(query),
      );

      return [
        ...accumulated,
        ...foundInSubjects.map(subject => {
          const path = createSubjectFilterPath(subject);
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
