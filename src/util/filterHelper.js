import queryString from 'query-string';

export const getFiltersFromUrl = location => {
  const urlParams = queryString.parse(location.search || '');
  return urlParams.filters || '';
};

export const getFiltersFromUrlAsArray = location => {
  const filters = getFiltersFromUrl(location);
  return filters.length > 0 ? filters.split(',') : [];
};
