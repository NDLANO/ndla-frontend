import queryString from 'query-string';
import config from '../../config';

export const searchResultToLinkProps = result => {
  if (result.resourceType === 'urn:resourcetype:learningPath') {
    return {
      href: `${config.learningPathDomain}/learningpaths/${
        result.id
      }/first-step`,
      target: '_blank',
      rel: 'noopener noreferrer',
    };
  } else if (result.paths && result.paths.length > 0) {
    return {
      to: result.paths[0],
    };
  }
  return { to: '/404' };
};

const arrayFields = [
  'language-filter',
  'levels',
  'subjects',
  'context-filters',
];

export const converSearchStringToObject = location => {
  const searchLocation = queryString.parse(location ? location.search : '');

  return {
    ...searchLocation,
    ...arrayFields
      .map(field => ({
        [field]: searchLocation[field] ? searchLocation[field].split(',') : [],
      }))
      .reduce((result, item) => {
        const key = Object.keys(item)[0];
        return { ...result, [key]: item[key] };
      }),
  };
};

export const convertSearchParam = value => {
  if (!value) {
    return undefined;
  } else if (Array.isArray(value)) {
    return value.length > 0 ? value.join(',') : undefined;
  } else if (Number.isInteger(value)) {
    return value;
  }
  return value.length > 0 ? value : undefined;
};
