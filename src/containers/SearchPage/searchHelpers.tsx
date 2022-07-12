import { ReactNode } from 'react';
import queryString from 'query-string';
import { TFunction } from 'i18next';
import { Location } from 'react-router-dom';
import { ContentTypeBadge, Image } from '@ndla/ui';
import {
  contentTypeMapping,
  resourceTypeMapping,
} from '../../util/getContentType';
import LtiEmbed from '../../lti/LtiEmbed';
import { getSubjectLongName, getSubjectById } from '../../data/subjects';
import { programmes } from '../../data/programmes';
import { LocaleType, LtiData } from '../../interfaces';
import {
  GQLGroupSearchQuery,
  GQLGroupSearchResourceFragment,
  GQLResourceTypeDefinition,
  GQLSearchContext,
} from '../../graphqlTypes';

const isSupplementary = (context: Pick<GQLSearchContext, 'relevance'>) => {
  return (
    // Consider getting from constants
    context?.relevance === 'Tilleggsstoff' ||
    context?.relevance === 'Supplementary'
  );
};

export const searchResultToLinkProps = (result: { path?: string }) => {
  return result.path ? { to: result.path } : { to: '/404' };
};

export const plainUrl = (url: string) => {
  const isLearningpath = url.includes('learningpath-api');
  const id = url.split('/').pop();
  return isLearningpath ? `/learningpaths/${id}` : `/article/${id}`;
};

const updateBreadcrumbSubject = (
  breadcrumbs: string[] | undefined,
  subjectId: string | undefined,
  subject: string | undefined,
  language: LocaleType | undefined,
) => {
  const longName = getSubjectLongName(subjectId, language);
  const breadcrumbSubject = longName || subject;
  const firstVal = breadcrumbSubject ? [breadcrumbSubject] : [];
  return [...firstVal, ...(breadcrumbs?.slice(1) ?? [])];
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

export const converSearchStringToObject = (
  location?: Location,
  locale?: LocaleType,
): Record<string, any> => {
  const searchLocation: Record<string, string> = queryString.parse(
    location?.search,
  );

  const fields = arrayFields.reduce<Record<string, string[]>>((acc, curr) => {
    acc[curr] = searchLocation[curr]?.split(',') ?? [];
    return acc;
  }, {});

  return {
    language: locale || 'nb',
    fallback: 'true',
    ...searchLocation,
    ...fields,
  };
};

export const convertSearchParam = (value: any) => {
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

export const convertProgramSearchParams = (
  values: string[],
  locale: LocaleType,
) => {
  const subjectParams: string[] = [];
  programmes.forEach(programme => {
    if (values.includes(programme.url[locale])) {
      programme.grades.forEach(grade =>
        grade.categories.forEach(category => {
          category.subjects.forEach(subject => {
            const { id } = getSubjectById(subject.id) ?? {};
            if (!!id && !subjectParams.includes(id)) subjectParams.push(id);
          });
        }),
      );
    }
  });
  return {
    subjects: subjectParams,
  };
};

interface ResultBase {
  id: number | string;
  title?: string;
  url: string | { href: string };
  contentType?: string;
  metaImage?: {
    url?: string;
    alt?: string;
  };
}

export const resultsWithContentTypeBadgeAndImage = <T extends ResultBase>(
  results: T[],
  t: TFunction,
  includeEmbedButton?: boolean,
  ltiData?: LtiData,
) =>
  results.map(result => {
    const { url, contentType, metaImage } = result;
    return {
      ...result,
      url,
      contenttypeicon: (
        // defaults to empty div if contentType is undefined.
        <ContentTypeBadge type={contentType ?? ''} size="x-small" background />
      ),
      children: includeEmbedButton && (
        <LtiEmbed ltiData={ltiData} item={result} />
      ),
      contentTypeLabel: contentType ? t(`contentTypes.${contentType}`) : '',
      image: metaImage && (
        <Image src={metaImage.url ?? ''} alt={metaImage.alt ?? ''} />
      ),
    };
  });

const mapTraits = (traits: string[] | undefined, t: TFunction) =>
  traits?.map(trait => {
    if (trait === 'VIDEO') {
      return t('resource.trait.video');
    } else if (trait === 'H5P') {
      return t('resource.trait.h5p');
    }
    return trait;
  }) ?? [];

const getLtiUrl = (
  path: string,
  id: number,
  isContext: boolean,
  language?: LocaleType,
) => {
  const commonPath = `article-iframe/${language ? `${language}/` : ''}`;
  if (isContext) {
    return `${commonPath}urn:${path.split('/').pop()}/${id}`;
  }
  return `${commonPath}article/${id}`;
};

const getContextLabels = (
  contexts: GQLGroupSearchResourceFragment['contexts'] | undefined,
) => {
  if (!contexts?.[0]) return [];
  const types = contexts[0].resourceTypes?.slice(1)?.map(t => t.name) ?? [];
  const relevance = isSupplementary(contexts[0]) ? [contexts[0].relevance] : [];
  const labels = types.concat(relevance);
  return labels.filter((label): label is string => label !== undefined);
};

export interface SearchItem {
  id: number;
  title: string;
  ingress: string;
  url: string;
  labels: string[];
  contexts?: {
    url: string;
    breadcrumb: string[];
    isAdditional: boolean;
  }[];
  children?: ReactNode;
  img?: {
    url: string;
    alt: string;
  };
}

export const mapResourcesToItems = (
  resources: GQLGroupSearchResourceFragment[],
  ltiData: LtiData | undefined,
  isLti: boolean,
  language: LocaleType | undefined,
  t: TFunction,
): SearchItem[] =>
  resources.map(resource => ({
    id: resource.id,
    title: resource.name,
    ingress: resource.ingress,
    url: isLti
      ? getLtiUrl(
          resource.path,
          resource.id,
          !!resource.contexts?.length,
          language,
        )
      : resource.contexts?.length
      ? resource.path
      : plainUrl(resource.path),
    labels: [
      ...mapTraits(resource.traits, t),
      ...getContextLabels(resource.contexts),
    ],
    contexts: resource.contexts?.map(context => ({
      url: context.path,
      breadcrumb: updateBreadcrumbSubject(
        context.breadcrumbs,
        context.subjectId,
        context.subject,
        context.language as LocaleType,
      ),
      isAdditional: isSupplementary(context),
    })),
    ...(resource.metaImage?.url && {
      img: {
        url: `${resource.metaImage.url}?width=${isLti ? '350' : '250'}`,
        alt: resource.name ?? resource.metaImage?.alt ?? '',
      },
    }),
    children: isLti ? (
      <LtiEmbed
        ltiData={ltiData}
        item={{
          id: resource.id,
          title: resource.name,
          url: resource.path,
        }}
      />
    ) : (
      undefined
    ),
  }));

export const sortResourceTypes = <T extends Record<string, any>>(
  array: T[],
  value: keyof T,
) => {
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

const getResourceTypeFilters = (
  resourceTypes: GQLResourceTypeDefinition | undefined,
  aggregations: (string | undefined)[] | undefined,
) => {
  return (
    resourceTypes?.subtypes
      ?.map(type => type.id)
      .filter(t => aggregations?.includes(t)) || []
  );
};

export interface SearchGroup {
  items: SearchItem[];
  resourceTypes: string[];
  totalCount: number;
  type: string;
}

export const mapSearchDataToGroups = (
  searchData: Required<GQLGroupSearchQuery>['groupSearch'] | undefined,
  resourceTypes: GQLResourceTypeDefinition[] | undefined,
  ltiData: LtiData | undefined,
  isLti: boolean | undefined,
  language: LocaleType | undefined,
  t: TFunction,
): SearchGroup[] => {
  if (!searchData) return [];
  return searchData.map(result => ({
    items: mapResourcesToItems(result.resources, ltiData, !!isLti, language, t),
    resourceTypes: getResourceTypeFilters(
      resourceTypes?.find(type => type.id === result.resourceType),
      result.aggregations?.[0]?.values?.map(value => value.value),
    ),
    totalCount: result.totalCount,
    type: contentTypeMapping[result.resourceType] || result.resourceType,
  }));
};

export interface TypeFilter {
  page: number;
  pageSize: number;
  selected: boolean;
  filters: SubTypeFilter[];
}

export interface SubTypeFilter {
  id: string;
  name: string;
  active: boolean;
}

export const getTypeFilter = (
  resourceTypes: GQLResourceTypeDefinition[] | undefined,
  selectedFilters: string[],
  activeSubFilters: string[],
  t: TFunction,
): Record<string, TypeFilter> => {
  const typeFilter: Record<string, TypeFilter> = {
    'topic-article': {
      page: 1,
      pageSize: 6,
      selected: selectedFilters?.some(f => f === 'topic-article'),
      filters: [],
    },
  };
  const subFilterMapping = activeSubFilters.reduce<Record<string, boolean>>(
    (acc, curr) => {
      acc[curr] = true;
      return acc;
    },
    {},
  );
  if (resourceTypes) {
    resourceTypes.forEach(type => {
      const filters: SubTypeFilter[] = [];
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
        filters.push({
          id: 'all',
          name: t('contentTypes.all'),
          active: !hasActive,
        });
        filters.push(...withActive);
      }
      const isSelected = selectedFilters?.some(
        f => f === contentTypeMapping[type.id],
      );
      const key = contentTypeMapping[type.id];
      if (!key) return;
      typeFilter[key] = {
        filters,
        page: 1,
        pageSize: isSelected ? 12 : 6,
        selected: isSelected,
      };
    });
  }
  return typeFilter;
};

export const getTypeParams = (
  types?: string[],
  allResourceTypes?: GQLResourceTypeDefinition[],
) => {
  if (!types?.length) {
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
