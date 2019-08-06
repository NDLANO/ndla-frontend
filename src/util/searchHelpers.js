import { FRONTPAGE_CATEGORIES } from '../constants';

export const searchSubjects = (query, locale) =>
  FRONTPAGE_CATEGORIES.categories.reduce((accumulated, category) => {
    query = query.trim().toLowerCase();
    const foundInSubjects = category.subjects.filter(subject =>
      subject.name.toLowerCase().includes(query),
    );
    return [
      ...accumulated,
      ...foundInSubjects.map(subject => ({
        id: subject.id,
        path: subject.id
          ? `/subjects/${subject.id.replace('urn:', '')}/`
          : `${locale ? `/${locale}` : ''}/node/${subject.nodeId}/`,
        subject: `${category.name.charAt(0).toUpperCase()}${category.name.slice(
          1,
        )}:`,
        name: subject.name,
      })),
    ];
  }, []);

export const mapSearchToFrontPageStructure = (data, t, query, locale) => {
  if (!data.frontpageSearch) return [];

  const {
    frontpageSearch: { learningResources, topicResources },
  } = data;
  const subjectHits = searchSubjects(query, locale);
  const subjects = {
    title: t('searchPage.label.subjects'),
    contentType: 'results-frontpage',
    resources: subjectHits,
  };
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
