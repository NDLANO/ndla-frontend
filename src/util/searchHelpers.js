import { FRONTPAGE_CATEGORIES } from '../constants';

const searchSubjects = (query, locale) =>
  FRONTPAGE_CATEGORIES.categories.reduce((accumelated, category) => {
    const foundInSubjects = category.subjects.filter(subject =>
      subject.name.toLowerCase().includes(query),
    );
    return foundInSubjects.length > 0
      ? foundInSubjects
          .map(subject => ({
            id: subject.id,
            path: subject.id
              ? `/subjects/${subject.id.replace('urn:', '')}/`
              : `${locale ? `/${locale}` : ''}/node/${subject.nodeId}/`,
            boldName: `${category.name
              .charAt(0)
              .toUpperCase()}${category.name.slice(1)}:`,
            name: subject.name,
          }))
          .concat(accumelated)
      : accumelated;
  }, []);

export const mapSearchToFrontPageStructure = (data, t, query, locale) => {
  query = query.trim().toLowerCase();

  const subjects = {
    title: t('searchPage.label.subjects'),
    contentType: 'results-frontpage',
    resources: searchSubjects(query, locale),
  };
  const topics = {
    title: `${t('subjectPage.tabs.topics')}:`,
    contentType: 'results-frontpage',
    resources: [],
  };
  const resource = {
    title: `${t('resource.label')}:`,
    contentType: 'results-frontpage',
    resources: [],
    totalCount: data.search && data.search.totalCount,
  };

  // distribute and group the result in right section
  const result = data.search && data.search.results ? data.search.results : [];
  result.forEach(resultData => {
    if (resultData && resultData.contexts && resultData.contexts.length !== 0) {
      resultData.contexts.forEach(ctx => {
        if (!ctx.id) {
          return false;
        }
        const resultItem = {
          id: `${resultData.id}-${ctx.id}`,
          path: `/subjects${ctx.path}`,
          boldName: `${ctx.subject}:`,
          name: resultData.title,
          subName:
            ctx.resourceTypes[0] && ctx.resourceTypes[0].name
              ? ctx.resourceTypes.map(type => type.name).join(', ') // TODO: translate
              : '',
        };
        if (
          ctx.id.includes('topic') &&
          topics.resources.filter(obj => obj.path === resultItem.path)
            .length === 0
        ) {
          topics.resources.push(resultItem);
        } else if (
          resource.resources.filter(obj => obj.path === resultItem.path)
            .length === 0
        ) {
          resource.resources.push(resultItem);
        }
      });
    }
  });
  const returnArray = [];
  // add groups into return array if there are any resources
  if (subjects.resources.length !== 0) {
    returnArray.push(subjects);
  }
  if (topics.resources.length !== 0) {
    returnArray.push(topics);
  }
  if (resource.resources.length !== 0) {
    returnArray.push(resource);
  }
  return returnArray;
};
