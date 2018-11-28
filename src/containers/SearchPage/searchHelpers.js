import React from 'react';
import queryString from 'query-string';
import { ContentTypeBadge, Image } from '@ndla/ui';
import config from '../../config';
import { contentTypeIcons } from '../../constants';
import { getContentType } from '../../util/getContentType';

const getRelevance = resource => {
  if (resource.filters.length > 0) {
    return (
      // Consider getting from constants
      resource.filters[0].relevance === 'Tilleggsstoff' ||
      resource.filters[0].relevance === 'Supplementary'
    );
  }
  return false;
};

const getResourceType = resource => {
  if (resource.resourceTypes.length > 0) {
    if (resource.resourceTypes.length > 1) {
      return resource.resourceTypes[1].name;
    }
    // Avoid showing name for single types
    if (
      resource.resourceTypes[0].id !== 'urn:resourcetype:learningPath' &&
      resource.resourceTypes[0].id !== 'urn:resourcetype:subjectMaterial'
    )
      return resource.resourceTypes[0].name;
  }
  return null;
};

const getUrl = (subject, result) => {
  if (subject.learningResourceType === 'learningpath') {
    return {
      href: `${config.learningPathDomain}/learningpaths/${
        result.id
      }/first-step`,
      target: '_blank',
      rel: 'noopener noreferrer',
    };
  }
  return `/subjects${subject.path}`;
};

export const selectContext = (contexts, filters, enabledTab) => {
  const filteredContext =
    enabledTab === 'topic-article'
      ? contexts.filter(context => context.id.startsWith('urn:topic'))
      : contexts;

  if (filteredContext.length === 0) return undefined;
  if (filters.length > 0) {
    const foundContext = filteredContext.filter(context =>
      filters.some(filter => context.path.includes(filter.replace('urn:', ''))),
    );
    if (foundContext.length > 0) return foundContext[0];
  }
  return filteredContext[0];
};

const taxonomyData = (result, selectedContext) => {
  let taxonomyResult = {};
  if (selectedContext) {
    taxonomyResult = {
      breadcrumb: selectedContext.breadcrumbs,
      contentType: getContentType(selectedContext),
      contentTypes: result.contexts.map(context => getContentType(context)),
      subjects:
        result.contexts > 1
          ? result.contexts.map(subject => ({
              url: getUrl(subject, result),
              title: subject.subject,
              contentType: getContentType(subject),
            }))
          : undefined,
      additional: getRelevance(selectedContext),
      type: getResourceType(selectedContext),
    };
  }
  return taxonomyResult;
};

export const searchResultToLinkProps = result => {
  if (result.resourceType === 'urn:resourcetype:learningPath') {
    return {
      to: `${config.learningPathDomain}/learningpaths/${result.id}/first-step`,
      target: '_blank',
      rel: 'noopener noreferrer',
    };
  }
  return { to: result.path || '/404' };
};

const arrayFields = ['languageFilter', 'levels', 'subjects', 'contextFilters'];

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

export const convertResult = (results, subjectFilters, enabledTab) =>
  results.map(result => {
    const selectedContext = selectContext(
      result.contexts,
      subjectFilters,
      enabledTab,
    );

    return {
      ...result,
      url: selectedContext ? getUrl(selectedContext, result) : result.url,
      urls: result.contexts.map(context => ({
        url: getUrl(context, result),
        contentType: getContentType(context),
      })),
      ingress: result.metaDescription,
      ...taxonomyData(result, selectedContext),
    };
  });

export const resultsWithContentTypeBadgeAndImage = (results, t) =>
  results.map(result => {
    const { contentType } = result;

    return {
      ...result,
      contentType,
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

export const getResultMetadata = search => ({
  pageSize: search.pageSize || 0,
  totalCount: search.totalCount || 0,
  lastPage: Math.ceil(search.totalCount / search.pageSize),
  totalCountLearningPaths: search.totalCountLearningPaths || 0,
  totalCountSubjectMaterial: search.totalCountSubjectMaterial || 0,
  totalCountTasks: search.totalCountTasks || 0,
});
