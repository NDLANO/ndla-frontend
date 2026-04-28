/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { CloseLine } from "@ndla/icons";
import { Button, CheckboxGroup, DialogContent, DialogRoot, DialogTrigger, Text } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { keyBy, sortBy } from "@ndla/util";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { BlockWrapper } from "../../../../components/MyNdla/BlockWrapper";
import { GQLFolder, GQLMyNdlaResource } from "../../../../graphqlTypes";
import { useMyNdlaResourceMetaSearch } from "../../../../mutations/folder/folderQueries";
import { useStableSearchParams } from "../../../../util/useStableSearchParams";
import { SORT_CONTENT_TYPE, SORT_NAME_ASC, SORT_NAME_DESC } from "../util";
import { CopyResourcesDialogContent, MoveResourcesDialogContent } from "./BatchProcessResources";
import { DeleteResourcesDialogContent } from "./DeleteResourcesDialogContent";
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
    gap: "medium",
    alignItems: "flex-end",
    marginLeft: "auto",
  },
});

const ListActionsWrapper = styled("div", {
  base: {
    display: "flex",
    flexWrap: "wrap",
    gap: "medium",
  },
});

const BatchSelectOptionsWrapper = styled("div", {
  base: {
    display: "flex",
    padding: "xsmall",
    gap: "xsmall",
    alignItems: "center",
    background: "surface.default",
    boxShadow: "xsmall",
    transitionDuration: "fast",
    transitionProperty: "opacity",
    transitionTimingFunction: "ease-in-out",
    minHeight: "3xlarge",
    opacity: "0",
  },
  variants: {
    visible: {
      true: {
        opacity: "1",
      },
      false: {},
    },
  },
});

const StyledButton = styled(Button, {
  base: {
    whiteSpace: "nowrap",
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
  const [selectedResourceIds, setSelectedResourceIds] = useState<string[]>([]);
  const [isBatchSelecting, setIsBatchSelecting] = useState(false);

  const { data, loading } = useMyNdlaResourceMetaSearch(
    resources.map((r) => ({
      id: r.resourceId,
      path: r.path,
      resourceType: r.resourceType,
    })),
  );

  const onSuccessfulMutation = useCallback(() => {
    setSelectedResourceIds([]);
    setIsBatchSelecting(false);
  }, []);

  const keyedResources = keyBy(resources, (resource) => resource.id);

  const selectedResources = useMemo(() => {
    return selectedResourceIds.reduce<GQLMyNdlaResource[]>((acc, curr) => {
      const found = keyedResources[curr];
      if (found) {
        acc.push(found);
      }
      return acc;
    }, []);
  }, [keyedResources, selectedResourceIds]);

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
      <ListActionsWrapper>
        <TagsFilter resources={resources} />
        <ListOptionsWrapper>
          <StyledButton
            variant="secondary"
            onClick={() => {
              if (isBatchSelecting) {
                setSelectedResourceIds([]);
              }
              setIsBatchSelecting((p) => !p);
            }}
            data-state={isBatchSelecting ? "on" : undefined}
          >
            {t("myNdla.resource.batchSelect")}
            {!!isBatchSelecting && <CloseLine />}
          </StyledButton>
          <ResourceSortOption />
        </ListOptionsWrapper>
      </ListActionsWrapper>
      <BatchSelectOptionsWrapper visible={!!selectedResources.length}>
        {!!selectedResources.length && (
          <>
            <DialogRoot>
              <DialogTrigger asChild>
                <Button variant="secondary">{t("myNdla.resource.move")}</Button>
              </DialogTrigger>
              <DialogContent>
                <MoveResourcesDialogContent
                  currentFolder={selectedFolder}
                  resources={selectedResources}
                  onSuccessfulMutation={onSuccessfulMutation}
                />
              </DialogContent>
            </DialogRoot>
            <DialogRoot>
              <DialogTrigger asChild>
                <Button variant="secondary">{t("myNdla.resource.copy")}</Button>
              </DialogTrigger>
              <DialogContent>
                <CopyResourcesDialogContent
                  currentFolder={selectedFolder}
                  resources={selectedResources}
                  onSuccessfulMutation={onSuccessfulMutation}
                />
              </DialogContent>
            </DialogRoot>
            <DialogRoot>
              <DialogTrigger asChild>
                <Button variant="secondary">{t("myNdla.resource.remove")}</Button>
              </DialogTrigger>
              <DialogContent>
                <DeleteResourcesDialogContent
                  selectedFolder={selectedFolder}
                  resourceIds={selectedResourceIds}
                  onSuccessfulMutation={onSuccessfulMutation}
                />
              </DialogContent>
            </DialogRoot>
          </>
        )}
      </BatchSelectOptionsWrapper>
      <CheckboxGroup value={selectedResourceIds} onValueChange={setSelectedResourceIds}>
        <BlockWrapper aria-labelledby={labelledBy}>
          {sortedAndFilteredResources.map((resource) => (
            <ResourceWithMenu
              resource={resource}
              key={resource.id}
              loading={loading}
              resourceMeta={keyedData[keyId(resource.resourceType, resource.resourceId)]}
              selectedFolder={selectedFolder}
              isBatchSelecting={isBatchSelecting}
              isSelected={selectedResourceIds.includes(resource.id)}
            />
          ))}
        </BlockWrapper>
      </CheckboxGroup>
    </ListContainer>
  );
};
