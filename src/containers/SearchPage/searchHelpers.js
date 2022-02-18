import React from 'react';
import queryString from 'query-string';
import { ContentTypeBadge, Image } from '@ndla/ui';
import {
  contentTypeMapping,
  resourceTypeMapping,
} from '../../util/getContentType';
import LtiEmbed from '../../lti/LtiEmbed';
import { parseAndMatchUrl } from '../../util/urlHelper';
import { programmes } from '../../data/programmes';

const isSupplementary = context => {
  return (
    // Consider getting from constants
    context?.relevance === 'Tilleggsstoff' ||
    context?.relevance === 'Supplementary'
  );
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

const updateBreadcrumbSubject = (breadcrumbs, subject, language) => {
  return [subject, ...breadcrumbs.slice(1)];
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
  programmes.forEach(programme => {
    if (values.includes(programme.url[locale])) {
      programme.grades.forEach(grade =>
        grade.categories.forEach(category => {
          category.subjects.forEach(subject => {
            if (!subjectParams.includes(subject.id))
              subjectParams.push(subject.id);
          });
        }),
      );
    }
  });
  return {
    subjects: subjectParams,
  };
};

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
      image: metaImage && (
        <Image src={metaImage.url} alt={metaImage.alt} width={'80px'} />
      ),
    };
  });

export const mergeTopicSubjects = results => {
  // Assuming that first element has the same values that the rest of the elements in the results array
  return [
    { ...results[0], subjects: results.flatMap(topic => topic.subjects) },
  ];
};

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

const getLtiUrl = (path, id, language) =>
  `article-iframe/${language ? `${language}/` : ''}urn:${path
    .split('/')
    .pop()}/${id}`;

export const mapResourcesToItems = (resources, ltiData, isLti, language, t) =>
  resources.map(resource => ({
    id: resource.id,
    title: resource.name,
    ingress: resource.ingress,
    url: isLti
      ? getLtiUrl(resource.path, resource.id, language)
      : resource.contexts?.length
      ? resource.path
      : plainUrl(resource.path),
    labels: [
      ...mapTraits(resource.traits, t),
      ...(resource.contexts?.length
        ? resource.contexts[0].resourceTypes.slice(1).map(type => type.name)
        : []),
      ...(isSupplementary(resource.contexts?.[0])
        ? [resource.contexts[0].relevance]
        : []),
    ],
    contexts: resource.contexts.map(context => ({
      url: context.path,
      breadcrumb: updateBreadcrumbSubject(
        context.breadcrumbs,
        context.subject,
        context.language,
      ),
      isAdditional: isSupplementary(context),
    })),
    ...(resource.metaImage?.url && {
      img: {
        url: `${resource.metaImage.url}?width=${isLti ? '350' : '250'}`,
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

export const mapSearchDataToGroups = (
  searchData,
  resourceTypes,
  ltiData,
  isLti,
  language,
  t,
) => {
  if (!searchData) return [];
  return searchData.map(result => ({
    items: mapResourcesToItems(result.resources, ltiData, isLti, language, t),
    resourceTypes: getResourceTypeFilters(
      resourceTypes.find(type => type.id === result.resourceType),
      result.aggregations?.[0]?.values.map(value => value.value),
    ),
    totalCount: result.totalCount,
    type: contentTypeMapping[result.resourceType] || result.resourceType,
  }));
};

export const getTypeFilter = (
  resourceTypes,
  selectedFilters,
  activeSubFilters,
) => {
  const typeFilter = {
    'topic-article': {
      page: 1,
      pageSize: 4,
      selected: selectedFilters?.some(f => f === 'topic-article'),
    },
  };
  const subFilterMapping = activeSubFilters.reduce((acc, curr) => {
    acc[curr] = true;
    return acc;
  }, {});
  if (resourceTypes) {
    resourceTypes.forEach(type => {
      const filters = [];
      if (type.subtypes) {
        const apiFilters = [...JSON.parse(JSON.stringify(type.subtypes))];
        let hasActive = false;
        const withActive = apiFilters.map(f => {
          if (subFilterMapping[`${contentTypeMapping[type.id]}:${f.id}`]) {
            f.active = true;
            hasActive = true;
          }
          return f;
        });
        withActive.sort((a, b) => a.id.localeCompare(b.id));
        filters.push({ id: 'all', name: 'Alle', active: !hasActive });
        filters.push(...withActive);
      }
      const isSelected = selectedFilters?.some(
        f => f === contentTypeMapping[type.id],
      );
      typeFilter[contentTypeMapping[type.id]] = {
        filters,
        page: 1,
        pageSize: isSelected ? 8 : 4,
        selected: isSelected,
      };
    });
  }
  return typeFilter;
};

export const getTypeParams = (types, allResourceTypes) => {
  if (!types.length) {
    return {
      resourceTypes: allResourceTypes
        ?.map(resourceType => resourceType.id)
        .join(),
      contextTypes: 'topic-article',
    };
  }
  const contextTypes = types.find(type => type === 'topic-article');
  if (contextTypes) {
    return {
      contextTypes,
    };
  }
  return {
    resourceTypes: types.map(type => resourceTypeMapping[type] || type).join(),
    contextTypes: undefined,
  };
};
