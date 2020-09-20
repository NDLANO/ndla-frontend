import React from 'react';
import queryString from 'query-string';
import { ContentTypeBadge, Image } from '@ndla/ui';
import { contentTypeIcons } from '../../constants';
import { getContentType } from '../../util/getContentType';
import LtiEmbed from '../../lti/LtiEmbed';
import { toSubjects } from '../../routeHelpers';
import { parseAndMatchUrl } from '../../util/urlHelper';
import { getSubjectBySubjectIdFilters } from '../../data/subjects';
import {
  RESOURCE_TYPE_LEARNING_PATH,
  RESOURCE_TYPE_SUBJECT_MATERIAL,
} from '../../constants';

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
      resource.resourceTypes[0].id !== RESOURCE_TYPE_LEARNING_PATH &&
      resource.resourceTypes[0].id !== RESOURCE_TYPE_SUBJECT_MATERIAL
    )
      return resource.resourceTypes[0].name;
  }
  return null;
};

const getUrl = subject => {
  const filterParam = subject.filters?.[0]?.id
    ? `?filters=${subject.filters?.[0]?.id}`
    : '';
  return `${toSubjects()}${subject.path}${filterParam}`;
};

export const searchResultToLinkProps = result => {
  return result.path ? { to: toSubjects() + result.path } : { to: '/404' };
};

export const selectContext = (contexts, filters, enabledTab) => {
  const filteredContext =
    enabledTab === 'topic-article'
      ? contexts.filter(context => context.id.startsWith('urn:topic'))
      : contexts;

  if (filteredContext.length === 0) return undefined;
  if (filters.length > 0) {
    const foundContext = filteredContext.filter(context =>
      filters.some(
        filter => context.path.split('/')?.[1] === filter.replace('urn:', ''),
      ),
    );
    if (foundContext.length > 0) return foundContext[0];
  }
  return filteredContext[0];
};

export const plainUrl = url => {
  const isLearningpath = url.includes('learningpath-api');
  const id = url.split('/').pop();
  return isLearningpath ? `/learningpaths/${id}` : `/article/${id}`;
};

const taxonomyData = (result, selectedContext) => {
  let taxonomyResult = {};
  const { contexts = [] } = result;
  if (selectedContext) {
    taxonomyResult = {
      breadcrumb: selectedContext.breadcrumbs,
      contentType: getContentType(selectedContext),
      contentTypes: contexts.map(context => getContentType(context)),
      subjects:
        contexts.length > 1
          ? contexts.map(subject => {
              const subjectData = getSubjectBySubjectIdFilters(
                subject.subjectId,
                subject.filters.map(f => f.id),
              );
              return {
                url: getUrl(subject, result),
                title:
                  subjectData?.longName[subject.language] || subject.subject,
                contentType: getContentType(subject),
              };
            })
          : undefined,
      additional: getRelevance(selectedContext),
      type: getResourceType(selectedContext),
    };
  } else {
    const isLearningpath = result.url.includes('learningpath-api');
    const contentType = isLearningpath ? 'learning-path' : 'subject-material';
    taxonomyResult = {
      contentType: contentType,
    };
  }
  return taxonomyResult;
};

const arrayFields = [
  'languageFilter',
  'levels',
  'subjects',
  'relevance',
  'resourceTypes',
  'contextTypes',
  'contextFilters',
  'grepCodes',
];

export const converSearchStringToObject = (location, locale) => {
  const searchLocation = queryString.parse(location?.search || '');

  return {
    language: locale || 'nb',
    fallback: 'true',
    ...searchLocation,
    ...arrayFields
      .map(field => ({
        [field]: searchLocation[field]?.split(',') || [],
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
  if (typeof value === 'boolean') {
    return value;
  }
  return value.length > 0 ? value : undefined;
};

export const convertResult = (results, subjectFilters, enabledTab, language) =>
  results.map(result => {
    const selectedContext = selectContext(
      result.contexts,
      subjectFilters,
      enabledTab,
    );
    return {
      ...result,
      url: selectedContext
        ? getUrl(selectedContext, result, language)
        : plainUrl(result.url),
      urls: result.contexts.map(context => ({
        url: getUrl(context, result),
        contentType: getContentType(context),
      })),
      ingress: result.metaDescription,
      ...taxonomyData(result, selectedContext),
    };
  });

const getResultUrl = (id, url, isLti) => {
  if ((url && url.href) || !isLti) {
    return url;
  }

  const parsedUrl = parseAndMatchUrl(url);
  if (!parsedUrl) {
    return url;
  }
  const {
    params: { topicId, resourceId },
  } = parsedUrl;
  const urnId =
    topicId && !resourceId ? `urn:${topicId}` : `urn:resource:${resourceId}`;
  return `/article-iframe/${urnId}/${id}`;
};
export const resultsWithContentTypeBadgeAndImage = (
  results,
  t,
  includeEmbedButton,
  ltiData,
  isLti = false,
) =>
  results.map(result => {
    const { id, url, urls, contentType, metaImage } = result;
    return {
      ...result,
      url: getResultUrl(id, url, isLti),
      urls: isLti
        ? urls.map(urlObject => ({
            ...urlObject,
            url: getResultUrl(id, urlObject.url, isLti),
          }))
        : urls,
      contentTypeIcon: contentTypeIcons[contentType] || (
        <ContentTypeBadge type={contentType} size="x-small" />
      ),
      children: includeEmbedButton && (
        <LtiEmbed ltiData={ltiData} item={result} />
      ),
      contentTypeLabel: contentType ? t(`contentTypes.${contentType}`) : '',
      image: metaImage && <Image src={metaImage.url} alt={metaImage.alt} />,
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
