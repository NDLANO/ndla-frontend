export const searchSubjects = (query, subjects) => {
  query = query?.trim().toLowerCase();
  if (!query || query.length < 2) {
    return [];
  }

  return subjects.filter(subject => subject.name.toLowerCase().includes(query));
};

export const frontPageSearchSuggestion = searchResult => {
  if (!searchResult.frontpageSearch) {
    return;
  }

  const {
    frontpageSearch: { learningResources, topicResources },
  } = searchResult;

  const suggestions = learningResources.suggestions
    .concat(topicResources.suggestions)
    .map(s => s?.suggestions?.[0]?.options?.[0])
    .filter(s => !!s)
    .sort((a, b) => b.score - a.score);
  return suggestions[0]?.text;
};

export const mapSearchToFrontPageStructure = (data, t, query, locale) => {
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
