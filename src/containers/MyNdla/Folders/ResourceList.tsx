/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import isEqual from 'lodash/isEqual';
import keyBy from 'lodash/keyBy';
import { useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useApolloClient } from '@apollo/client';
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from '@dnd-kit/modifiers';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
import { Reference } from '@apollo/client/cache';
import { GQLFolder } from '../../../graphqlTypes';
import {
  useFolderResourceMetaSearch,
  useSortResourcesMutation,
} from '../folderMutations';
import { BlockWrapper, ViewType } from './FoldersPage';
import { makeDndSortFunction, makeDndTranslations } from './util';
import DraggableResource from './DraggableResource';

interface Props {
  selectedFolder: GQLFolder;
  viewType: ViewType;
  resourceRefId?: string;
}

const ResourceListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xsmall};
`;

const ResourceList = ({ selectedFolder, viewType, resourceRefId }: Props) => {
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
    if (!isEqual(resourceIds, prevResourceIds) && focusId) {
      setTimeout(
        () =>
          document
            .getElementById(`resource-${focusId}`)
            ?.getElementsByTagName('a')?.[0]
            ?.focus(),
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
    const sortCacheModifierFunction = <T extends Reference>(
      existing: readonly T[],
    ): T[] => {
      return newOrder.map(
        (id) => existing.find((ef) => ef.__ref === `FolderResource:${id}`)!,
      );
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

  const announcements = useMemo(
    () => makeDndTranslations('resource', t, resources.length),
    [t, resources],
  );

  const keyedData = keyBy(
    data ?? [],
    (resource) => `${resource.type}-${resource.id}`,
  );

  return (
    <ResourceListWrapper>
      <BlockWrapper data-type={viewType}>
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
            {resources.map((resource, index) => {
              const resourceMeta =
                keyedData[`${resource.resourceType}-${resource.resourceId}`];
              return (
                <DraggableResource
                  resource={resource}
                  key={resource.id}
                  index={index}
                  loading={loading}
                  viewType={viewType}
                  resourceMeta={resourceMeta}
                  resources={resources}
                  setFocusId={setFocusId}
                  selectedFolder={selectedFolder}
                  resourceRefId={resourceRefId}
                />
              );
            })}
          </SortableContext>
        </DndContext>
      </BlockWrapper>
    </ResourceListWrapper>
  );
};

export default ResourceList;
