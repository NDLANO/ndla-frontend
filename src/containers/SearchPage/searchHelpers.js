import React from 'react';
import queryString from 'query-string';
import { ContentTypeBadge, Image } from '@ndla/ui';
import { getContentType, contentTypeMapping } from '../../util/getContentType';
import LtiEmbed from '../../lti/LtiEmbed';
import { parseAndMatchUrl } from '../../util/urlHelper';
import { getSubjectLongName, getSubjectById } from '../../data/subjects';
import { programmes } from '../../data/programmes';
import {
  RESOURCE_TYPE_LEARNING_PATH,
  RESOURCE_TYPE_SUBJECT_MATERIAL,
} from '../../constants';

const getRelevance = context => {
  // Consider getting from constants
  return (
    context?.relevance === 'Tilleggsstoff' ||
    context?.relevance === 'Supplementary'
  );
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
  return `${subject.path}${filterParam}`;
};

export const searchResultToLinkProps = result => {
  return result.path ? { to: result.path } : { to: '/404' };
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

const updateBreadcrumbSubject = (breadcrumbs, subjectId, subject, language) => {
  const longName = getSubjectLongName(subjectId, language);
  const breadcrumbSubject = longName || subject;
  return [breadcrumbSubject, ...breadcrumbs.slice(1)];
};

const taxonomyData = (result, selectedContext) => {
  let taxonomyResult = {};
  const { contexts = [] } = result;
  if (selectedContext) {
    selectedContext.breadcrumbs = updateBreadcrumbSubject(
      selectedContext.breadcrumbs,
      selectedContext.subjectId,
      selectedContext.subject,
      selectedContext.filters,
      selectedContext.language,
    );
    taxonomyResult = {
      breadcrumb: selectedContext.breadcrumbs,
      contentType: getContentType(selectedContext),
      contentTypes: contexts.map(context => getContentType(context)),
      subjects:
        contexts.length > 1
          ? contexts.map(context => {
              const longName = getSubjectLongName(
                context.subjectId,
                context.language,
              );
              return {
                url: getUrl(context, result),
                title: longName || context.subject,
                contentType: getContentType(context),
                breadcrumb: context.breadcrumbs,
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
  'subjects',
  'programs',
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

export const convertProgramSearchParams = (values, locale) => {
  const subjectParams = [];
  const filterParams = [];
  programmes.forEach(programme => {
    if (values.includes(programme.url[locale])) {
      programme.grades.forEach(grade =>
        grade.categories.forEach(category => {
          category.subjects.forEach(subject => {
            const { subjectId, filters } = getSubjectById(subject.id);
            if (!subjectParams.includes(subjectId))
              subjectParams.push(subjectId);
            if (!filterParams.includes(filters[0]))
              filterParams.push(filters[0]);
          });
        }),
      );
    }
  });
  return {
    subjects: subjectParams,
    filters: filterParams,
  };
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
      contentTypeIcon: (
        <ContentTypeBadge type={contentType} size="x-small" background />
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

const mapTraits = (traits, t) =>
  traits.map(trait => {
    if (trait === 'VIDEO') {
      return t('resource.trait.video');
    } else if (trait === 'H5P') {
      return t('resource.trait.h5p');
    }
    return trait;
  });

const getLtiUrl = (path, id) => `article-iframe/${path.split('/').pop()}/${id}`;

const getContextUrl = context =>
  context?.filters?.length
    ? `${context.path}?filters=${context.filters[0].id}`
    : context.path;

const mapResourcesToItems = (resources, ltiData, isLti, t) =>
  resources.map(resource => ({
    id: resource.id,
    title: resource.name,
    ingress: resource.ingress,
    url: isLti
      ? getLtiUrl(resource.path, resource.id)
      : resource.contexts?.length
      ? resource.path
      : plainUrl(resource.path),
    labels: [
      ...mapTraits(resource.traits, t),
      ...(resource.contexts?.length
        ? resource.contexts[0].resourceTypes.slice(1).map(type => type.name)
        : []),
      ...(getRelevance(resource.contexts?.[0])
        ? [getRelevance(resource.contexts[0])]
        : []),
    ],
    contexts: resource.contexts.map(context => ({
      url: getContextUrl(context),
      breadcrumb: updateBreadcrumbSubject(
        context.breadcrumbs,
        context.subjectId,
        context.subject,
        context.filters,
        context.language,
      ),
    })),
    ...(resource.metaImage?.url && {
      img: {
        url: `${resource.metaImage.url}?width=250`,
        alt: resource.metaImage?.alt,
      },
    }),
    children: isLti && (
      <LtiEmbed
        ltiData={ltiData}
        item={{
          id: resource.id,
          title: resource.name,
          url: resource.path,
        }}
      />
    ),
  }));

export const sortResourceTypes = (array, value) => {
  const sortedResourceTypes = [
    'topic-article',
    'subject-material',
    'tasks-and-activities',
    'learning-path',
    'assessment-resources',
    'external-learning-resources',
    'source-material',
  ];
  return array.sort(
    (a, b) =>
      sortedResourceTypes.indexOf(a[value]) -
      sortedResourceTypes.indexOf(b[value]),
  );
};

const getResourceTypeFilters = (resourceTypes, aggregations) => {
  return (
    resourceTypes?.subtypes
      ?.map(type => type.id)
      .filter(t => aggregations.includes(t)) || []
  );
};

export const updateSearchGroups = (
  searchData,
  searchGroups,
  resourceTypes,
  pageSize,
  replaceItems,
  newSearch,
  ltiData,
  isLti,
  t,
) => {
  if (newSearch) {
    return searchData.map(result => ({
      items: mapResourcesToItems(result.resources, ltiData, isLti, t),
      resourceTypes: getResourceTypeFilters(
        resourceTypes.find(type => type.id === result.resourceType),
        result.aggregations?.[0]?.values.map(value => value.value),
      ),
      totalCount: result.totalCount,
      type: contentTypeMapping[result.resourceType] || result.resourceType,
    }));
  }
  return searchGroups.map(group => {
    const searchResults = searchData.filter(result => {
      const resultType =
        contentTypeMapping[result.resourceType] || result.resourceType;
      return (
        group.type === resultType || group.resourceTypes.includes(resultType)
      );
    });
    if (searchResults.length) {
      const result = searchResults.reduce((accumulator, currentValue) => ({
        ...currentValue,
        resources: [...currentValue.resources, ...accumulator.resources],
        totalCount: currentValue.totalCount + accumulator.totalCount,
      }));
      const resources = result.resources.slice(0, pageSize);
      return {
        ...group,
        items: replaceItems
          ? mapResourcesToItems(resources, ltiData, isLti, t)
          : [
              ...group.items,
              ...mapResourcesToItems(resources, ltiData, isLti, t),
            ],
        totalCount: result.totalCount,
      };
    }
    return group;
  });
};

export const getTypeFilter = resourceTypes => {
  const typeFilter = {
    'topic-article': {
      page: 1,
      pageSize: 4,
      loading: true,
    },
  };
  if (resourceTypes) {
    resourceTypes.forEach(type => {
      const filters = [];
      if (type.subtypes) {
        filters.push({ id: 'all', name: 'Alle', active: true });
        filters.push(...JSON.parse(JSON.stringify(type.subtypes)));
      }
      typeFilter[contentTypeMapping[type.id]] = {
        filters,
        page: 1,
        pageSize: 4,
        loading: true,
      };
    });
  }
  return typeFilter;
};

export const getTypeParams = (type, resourceTypes) => {
  if (!type) {
    return {
      resourceTypes: resourceTypes.map(resourceType => resourceType.id).join(),
      contextTypes: 'topic-article',
    };
  } else if (type === 'topic-article') {
    return {
      contextTypes: type,
    };
  }
  return {
    resourceTypes: type,
  };
};
