import React from 'react';
import queryString from 'query-string';
import { ContentTypeBadge, Image } from 'ndla-ui';
import config from '../../config';
import { contentTypeIcons } from '../../constants';

export const searchResultToLinkProps = result => {
  if (result.resourceType === 'urn:resourcetype:learningPath') {
    return {
      to: `${config.learningPathDomain}/learningpaths/${result.id}/first-step`,
      target: '_blank',
      rel: 'noopener noreferrer',
    };
  }
  if (result.paths && result.paths.length > 0) {
    return {
      to: result.paths[0],
    };
  }
  return { to: '/404' };
};

const arrayFields = ['language-filter', 'levels', 'subjects', 'contextFilters'];

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
  }
  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(',') : undefined;
  }
  if (Number.isInteger(value)) {
    return value;
  }
  return value.length > 0 ? value : undefined;
};

export const resultsWithContentTypeBadgeAndImage = (results, t, type) =>
  results.map(result => {
    /* There are multiple items that are both subjects and resources
    We filter out for the correct context (subject) */
    let [contentType] = result.contentTypes;
    let [url] = result.urls.map(item => item.url);
    if (type && type === 'topic-article') {
      [contentType] = result.contentTypes.filter(
        contentTypeItem => contentTypeItem === 'subject',
      );
      [url] = result.urls
        .filter(urlItem => urlItem.contentType === 'subject')
        .map(item => item.url);
    }

    return {
      ...result,
      contentType: contentType || result.contentType,
      url: url || result.url,
      contentTypeIcon: contentTypeIcons[contentType || result.contentType] || (
        <ContentTypeBadge
          type={contentType || result.contentType}
          size="x-small"
        />
      ),
      contentTypeLabel:
        contentType || result.contentType
          ? t(`contentTypes.${contentType || result.contentType}`)
          : '',
      image: result.metaImage ? (
        <Image src={result.metaImage.url} alt={result.metaImage.alt} />
      ) : (
        undefined
      ),
    };
  });
