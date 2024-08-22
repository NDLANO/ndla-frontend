/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { TFunction } from "i18next";
import queryString from "query-string";
import { ReactNode } from "react";
import { Location } from "react-router-dom";
import { constants } from "@ndla/ui";
import { RELEVANCE_SUPPLEMENTARY } from "../../constants";
import {
  GQLGroupSearchQuery,
  GQLGroupSearchResourceFragment,
  GQLResourceTypeDefinition,
  GQLSubjectInfoFragment,
} from "../../graphqlTypes";
import { LocaleType, LtiData } from "../../interfaces";
import LtiEmbed from "../../lti/LtiEmbed";
import { contentTypeMapping, resourceTypeMapping } from "../../util/getContentType";

const { contentTypes } = constants;

export const searchResultToLinkProps = (result?: { path?: string }) => {
  return result?.path ? { to: result.path } : { to: "/404" };
};

export const plainUrl = (url: string) => {
  const isLearningpath = url.includes("learningpath-api");
  const id = url.split("/").pop();
  return isLearningpath ? `/learningpaths/${id}` : `/article/${id}`;
};

const arrayFields = [
  "languageFilter",
  "subjects",
  "programs",
  "relevance",
  "resourceTypes",
  "contextTypes",
  "contextFilters",
  "grepCodes",
];

export const converSearchStringToObject = (
  location?: Pick<Location, "search">,
  locale?: LocaleType,
): Record<string, any> => {
  const searchLocation: Record<string, string> = queryString.parse(location?.search);

  const fields = arrayFields.reduce<Record<string, string[]>>((acc, curr) => {
    acc[curr] = searchLocation[curr]?.split(",") ?? [];
    return acc;
  }, {});

  return {
    language: locale || "nb",
    fallback: "true",
    ...searchLocation,
    ...fields,
  };
};

export const convertSearchParam = (value?: any) => {
  if (!value) {
    return undefined;
  }
  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(",") : undefined;
  }
  if (Number.isInteger(value)) {
    return value;
  }
  if (typeof value === "boolean") {
    return value;
  }
  return value.length > 0 ? value : undefined;
};

const mapTraits = (traits: string[] | undefined, t: TFunction) =>
  traits?.map((trait) => {
    if (trait === "VIDEO") {
      return t("resource.trait.video");
    } else if (trait === "H5P") {
      return t("resource.trait.h5p");
    }
    return trait;
  }) ?? [];

const getLtiUrl = (path: string, id: number, isContext: boolean, language?: LocaleType) => {
  const commonPath = `/article-iframe/${language ? `${language}/` : ""}`;
  if (isContext) {
    return `${commonPath}urn:${path.split("/").pop()}/${id}`;
  }
  return `${commonPath}article/${id}`;
};

const getContextLabels = (contexts: GQLGroupSearchResourceFragment["contexts"] | undefined) => {
  if (!contexts?.[0]) return [];
  const types = contexts[0].resourceTypes?.slice(1)?.map((t) => t.name) ?? [];
  const relevance = contexts[0].relevanceId === RELEVANCE_SUPPLEMENTARY ? [contexts[0].relevance] : [];
  const labels = types.concat(relevance);
  return labels.filter((label): label is string => label !== undefined);
};

export interface SearchItem {
  id: number | string;
  title: string;
  ingress?: string;
  url: string;
  labels?: string[];
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
  enablePrettyUrls: boolean,
  t: TFunction,
): SearchItem[] =>
  resources.map((resource) => ({
    id: resource.id,
    title: resource.name,
    ingress: resource.ingress,
    url: isLti
      ? getLtiUrl(resource.path, resource.id, !!resource.contexts?.length, language)
      : resource.contexts?.length
        ? (enablePrettyUrls ? resource.contexts[0]?.url : resource.contexts[0]?.path) || resource.path
        : plainUrl(resource.path),
    labels: [...mapTraits(resource.traits, t), ...getContextLabels(resource.contexts)],
    contexts: resource.contexts?.map((context) => ({
      url: enablePrettyUrls ? context.url ?? context.path : context.path,
      breadcrumb: context.breadcrumbs,
      isAdditional: context?.relevanceId === RELEVANCE_SUPPLEMENTARY,
    })),
    ...(resource.metaImage?.url && {
      img: {
        url: resource.metaImage.url,
        alt: resource.name ?? resource.metaImage?.alt ?? "",
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
    ) : undefined,
  }));

export const sortResourceTypes = <T extends Record<string, any>>(array: T[], value: keyof T) => {
  const sortedResourceTypes = [
    "subject",
    "topic-article",
    "subject-material",
    "tasks-and-activities",
    "learning-path",
    "assessment-resources",
    "source-material",
    "concept",
  ];
  return array.sort((a, b) => sortedResourceTypes.indexOf(a[value]) - sortedResourceTypes.indexOf(b[value]));
};

const getResourceTypeFilters = (
  resourceTypes: GQLResourceTypeDefinition | undefined,
  aggregations: (string | undefined)[] | undefined,
) => {
  return resourceTypes?.subtypes?.map((type) => type.id).filter((t) => aggregations?.includes(t)) || [];
};

export interface SearchGroup {
  items: SearchItem[];
  resourceTypes: string[];
  totalCount: number;
  type: string;
}

export const mapSearchDataToGroups = (
  searchData: Required<GQLGroupSearchQuery>["groupSearch"] | undefined,
  resourceTypes: GQLResourceTypeDefinition[] | undefined,
  ltiData: LtiData | undefined,
  isLti: boolean | undefined,
  language: LocaleType | undefined,
  enablePrettyUrls: boolean,
  t: TFunction,
): SearchGroup[] => {
  if (!searchData) return [];
  return searchData.map((result) => ({
    items: mapResourcesToItems(result.resources, ltiData, !!isLti, language, enablePrettyUrls, t),
    resourceTypes: getResourceTypeFilters(
      resourceTypes?.find((type) => type.id === result.resourceType),
      result.aggregations?.[0]?.values?.map((value) => value.value),
    ),
    totalCount: result.totalCount,
    type: contentTypeMapping[result.resourceType] || result.resourceType,
  }));
};

export const mapSubjectDataToGroup = (
  subjectData: GQLSubjectInfoFragment[] | undefined,
  enablePrettyUrls: boolean,
): SearchGroup[] => {
  if (!subjectData) return [];
  return [
    {
      items: subjectData.map((subject) => ({
        id: subject.id,
        title: subject.name,
        url: enablePrettyUrls ? subject.url : subject.path,
      })),
      resourceTypes: [],
      totalCount: subjectData.length,
      type: contentTypes.SUBJECT,
    },
  ];
};

export interface TypeFilter {
  page: number;
  pageSize: number;
  filters: SubTypeFilter[];
  selected: string[];
}

export interface SubTypeFilter {
  name: string;
  id: string;
}

export const getTypeFilter = (
  resourceTypes: GQLResourceTypeDefinition[] | undefined,
  selectedFilters: string[],
  activeSubFilters: string[],
  t: TFunction,
): Record<string, TypeFilter> => {
  const typeFilter: Record<string, TypeFilter> = {
    subject: { page: 1, pageSize: selectedFilters.some((s) => s === "subject") ? 12 : 6, filters: [], selected: [] },
    "topic-article": {
      page: 1,
      pageSize: selectedFilters.some((s) => s === "topic-article") ? 12 : 6,
      filters: [],
      selected: [],
    },
  };
  const subFilterMapping = activeSubFilters.reduce<Record<string, boolean>>((acc, curr) => {
    acc[curr] = true;
    return acc;
  }, {});
  if (resourceTypes) {
    resourceTypes.forEach((type) => {
      const filters: SubTypeFilter[] = [];
      if (type.subtypes) {
        const apiFilters = [...JSON.parse(JSON.stringify(type.subtypes))];
        apiFilters.sort((a, b) => a.id.localeCompare(b.id));
        filters.push({
          id: "all",
          name: t("contentTypes.all"),
        });
        filters.push(...apiFilters);
      }
      const isSelected = selectedFilters?.some((f) => f === contentTypeMapping[type.id]);
      const key = contentTypeMapping[type.id];
      if (!key) return;
      const activeTypeFilters = filters.filter(
        (filter) => !!subFilterMapping[`${contentTypeMapping[type.id]}:${filter.id}`],
      );

      typeFilter[key] = {
        filters,
        page: 1,
        pageSize: isSelected ? 12 : 6,
        selected: activeTypeFilters.length ? activeTypeFilters.map((activeFilter) => activeFilter.id) : ["all"],
      };
    });
  }
  return typeFilter;
};

export const getTypeParams = (types?: string[], allResourceTypes?: GQLResourceTypeDefinition[]) => {
  if (!types?.length) {
    return {
      resourceTypes: allResourceTypes?.map((resourceType) => resourceType.id).join(),
      contextTypes: "topic-article",
    };
  }
  const contextTypes = types.find((type) => type === "topic-article");
  if (contextTypes) {
    return {
      contextTypes,
    };
  }
  return {
    resourceTypes: types.map((type) => resourceTypeMapping[type] || type).join(),
    contextTypes: undefined,
  };
};
