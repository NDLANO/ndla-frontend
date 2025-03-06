/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { keyBy } from "lodash-es";
import { useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useApolloClient, Reference } from "@apollo/client";
import { useSensors, useSensor, PointerSensor, KeyboardSensor, DndContext, closestCenter } from "@dnd-kit/core";
import { restrictToVerticalAxis, restrictToParentElement } from "@dnd-kit/modifiers";
import { sortableKeyboardCoordinates, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { styled } from "@ndla/styled-system/jsx";
import DraggableResource from "./DraggableResource";
import { BlockWrapper } from "../../../../components/MyNdla/BlockWrapper";
import { GQLFolder } from "../../../../graphqlTypes";
import { useSortResourcesMutation, useFolderResourceMetaSearch } from "../../folderMutations";
import { makeDndSortFunction, makeDndTranslations } from "../util";

const StyledBlockWrapper = styled(BlockWrapper, {
  base: {
    paddingBlockStart: "xxlarge",
  },
});

interface Props {
  selectedFolder: GQLFolder;
  resourceRefId?: string;
}

const ResourceList = ({ selectedFolder, resourceRefId }: Props) => {
  const { t } = useTranslation();
  const client = useApolloClient();
  const resources = useMemo(() => selectedFolder.resources, [selectedFolder]);
  const { sortResources } = useSortResourcesMutation();

  const [focusId, setFocusId] = useState<string | undefined>(undefined);
  const [sortedResources, setSortedResources] = useState(resources);
  const [prevResources, setPrevResources] = useState(resources);

  useEffect(() => {
    setSortedResources(resources);
  }, [resources]);

  useEffect(() => {
    const resourceIds = resources.map((f) => f.id).sort();
    const prevResourceIds = prevResources?.map((f) => f.id).sort();
    const isEqual =
      resourceIds.length === prevResourceIds.length && resourceIds.every((v, i) => v === prevResourceIds[i]);
    if (!isEqual && focusId) {
      setTimeout(
        () => document.getElementById(`resource-${focusId}`)?.getElementsByTagName("a")?.[0]?.focus(),
        // Timeout needs to be bigger than 0 in order for timeout to execute on FireFox
        1,
      );
      setFocusId(undefined);
      setPrevResources(resources);
    }
  }, [resources, prevResources, focusId]);

  const { data, loading } = useFolderResourceMetaSearch(
    resources.map((r) => ({
      id: r.resourceId,
      path: r.path,
      resourceType: r.resourceType,
    })),
  );

  const updateCache = (newOrder: string[]) => {
    const sortCacheModifierFunction = <T extends Reference>(existing: readonly T[]): T[] => {
      return newOrder.map((id) => existing.find((ef) => ef.__ref === `FolderResource:${id}`)!);
    };

    if (selectedFolder.id) {
      client.cache.modify({
        id: client.cache.identify({
          __ref: `Folder:${selectedFolder.id}`,
        }),
        fields: { resources: sortCacheModifierFunction },
      });
    }
  };

  const sortResourceIds = makeDndSortFunction(
    selectedFolder.id,
    resources,
    sortResources,
    updateCache,
    setSortedResources,
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const announcements = useMemo(() => makeDndTranslations("resource", t, resources.length), [t, resources]);

  const keyedData = keyBy(data ?? [], (resource) => `${resource.type}-${resource.id}`);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={sortResourceIds}
      accessibility={{ announcements }}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
    >
      <SortableContext
        items={sortedResources}
        disabled={sortedResources.length < 2}
        strategy={verticalListSortingStrategy}
      >
        <StyledBlockWrapper>
          {resources.map((resource, index) => {
            const resourceMeta = keyedData[`${resource.resourceType}-${resource.resourceId}`];
            return (
              <DraggableResource
                resource={resource}
                key={resource.id}
                index={index}
                loading={loading}
                resourceMeta={resourceMeta}
                resources={resources}
                setFocusId={setFocusId}
                selectedFolder={selectedFolder}
                resourceRefId={resourceRefId}
              />
            );
          })}
        </StyledBlockWrapper>
      </SortableContext>
    </DndContext>
  );
};

export default ResourceList;
