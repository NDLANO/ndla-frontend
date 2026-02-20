/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Text } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { keyBy, sortBy } from "@ndla/util";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { BlockWrapper } from "../../../../components/MyNdla/BlockWrapper";
import { GQLFolder, GQLMyNdlaResource } from "../../../../graphqlTypes";
import { useMyNdlaResourceMetaSearch } from "../../../../mutations/folder/folderQueries";
import { useStableSearchParams } from "../../../../util/useStableSearchParams";
import { SORT_CONTENT_TYPE, SORT_NAME_ASC, SORT_NAME_DESC } from "../util";
import { ResourceSortOption } from "./ResourceSortOption";
import { ResourceWithMenu } from "./ResourceWithMenu";
import { TagsFilter } from "./TagsFilter";

const ListContainer = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "medium",
  },
});

const ListOptionsWrapper = styled("div", {
  base: {
    display: "flex",
    justifyContent: "space-between",
    gap: "medium",
    alignItems: "flex-end",
  },
});

const keyId = (type: string, id: string) => `${type}-${id}`;

interface Props {
  selectedFolder: GQLFolder | undefined;
  resources: GQLMyNdlaResource[];
  labelledBy: string;
}

export const ResourceList = ({ selectedFolder, resources, labelledBy }: Props) => {
  const { t } = useTranslation();
  const [params] = useStableSearchParams();

  const { data, loading } = useMyNdlaResourceMetaSearch(
    resources.map((r) => ({
      id: r.resourceId,
      path: r.path,
      resourceType: r.resourceType,
    })),
  );

  const keyedData = keyBy(data ?? [], (resource) => keyId(resource.type, resource.id));

  const sortedAndFilteredResources = useMemo(() => {
    let _resources = resources;
    const tagFilters = params.get("tags")?.split(",") ?? [];
    if (tagFilters.length) {
      _resources = _resources.filter((r) => tagFilters.some((tag) => r.tags.includes(tag)));
    }
    const sortParam = params.get("sort");
    if (sortParam === SORT_NAME_DESC) {
      return sortBy(_resources, (r) => keyedData[keyId(r.resourceType, r.resourceId)]?.title?.toLowerCase()).reverse();
    } else if (sortParam === SORT_NAME_ASC) {
      return sortBy(_resources, (r) => keyedData[keyId(r.resourceType, r.resourceId)]?.title?.toLowerCase());
    } else if (sortParam === SORT_CONTENT_TYPE) {
      return sortBy(_resources, (r) => r.resourceType);
    } else {
      return sortBy(_resources, (r) => r.created).toReversed();
    }
  }, [keyedData, params, resources]);

  if (!sortedAndFilteredResources.length) {
    return <Text>{t("myNdla.folder.noResources")}</Text>;
  }

  return (
    <ListContainer>
      <ListOptionsWrapper>
        <TagsFilter resources={resources} />
        <ResourceSortOption />
      </ListOptionsWrapper>
      <BlockWrapper aria-labelledby={labelledBy}>
        {sortedAndFilteredResources.map((resource) => (
          <ResourceWithMenu
            resource={resource}
            key={resource.id}
            loading={loading}
            resourceMeta={keyedData[keyId(resource.resourceType, resource.resourceId)]}
            selectedFolder={selectedFolder}
          />
        ))}
      </BlockWrapper>
    </ListContainer>
  );
};
