/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { isEqual, keyBy } from 'lodash';
import { useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSnack } from '@ndla/ui';
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
import AddResourceToFolderModal from '../../../components/MyNdla/AddResourceToFolderModal';
import { GQLFolder, GQLFolderResource } from '../../../graphqlTypes';
import DeleteModal from '../components/DeleteModal';
import {
  useDeleteFolderResourceMutation,
  useFolderResourceMetaSearch,
  useSortResourcesMutation,
} from '../folderMutations';
import { BlockWrapper, ViewType } from './FoldersPage';
import { usePrevious } from '../../../util/utilityHooks';
import DraggableResource from './DraggableResource';
import { makeDndSortFunction } from './util';

interface Props {
  selectedFolder: GQLFolder;
  viewType: ViewType;
  folderId: string;
}

export type ResourceActionType = 'add' | 'delete';
export interface ResourceAction {
  action: ResourceActionType;
  resource: GQLFolderResource;
  index?: number;
}

const ResourceList = ({ selectedFolder, viewType, folderId }: Props) => {
  const { t } = useTranslation();
  const { addSnack } = useSnack();
  const client = useApolloClient();
  const { sortResources } = useSortResourcesMutation();
  const [focusId, setFocusId] = useState<string | undefined>(undefined);
  const [resourceAction, setResourceAction] = useState<
    ResourceAction | undefined
  >(undefined);

  const resources = useMemo(() => selectedFolder.resources, [selectedFolder]);
  const prevResources = usePrevious(resources);

  useEffect(() => {
    const resourceIds = resources.map(f => f.id).sort();
    const prevResourceIds = prevResources?.map(f => f.id).sort();

    if (!isEqual(resourceIds, prevResourceIds) && focusId) {
      setTimeout(
        () =>
          document
            .getElementById(`resource-${focusId}`)
            ?.getElementsByTagName('a')?.[0]
            ?.focus(),
        0,
      );
      setFocusId(undefined);
    }
  }, [resources, prevResources, focusId]);

  const { data, loading } = useFolderResourceMetaSearch(
    resources.map(r => ({
      id: r.resourceId,
      path: r.path,
      resourceType: r.resourceType,
    })),
  );

  const onDeleteFolder = async (
    resource: GQLFolderResource,
    index?: number,
  ) => {
    const next = index !== undefined ? resources[index + 1]?.id : undefined;
    const prev = index !== undefined ? resources[index - 1]?.id : undefined;
    await deleteFolderResource({
      variables: { folderId, resourceId: resource.id },
    });
    addSnack({
      id: `removedFromFolder${selectedFolder.id}`,
      content: t('myNdla.resource.removedFromFolder', {
        folderName: selectedFolder.name,
      }),
    });
    setFocusId(next ?? prev);
  };

  const keyedData = keyBy(
    data ?? [],
    resource => `${resource.type}-${resource.id}`,
  );

  const { deleteFolderResource } = useDeleteFolderResourceMutation(
    selectedFolder.id,
  );

  const updateCache = (newOrder: string[]) => {
    const sortCacheModifierFunction = (
      existing: (GQLFolder & { __ref: string })[],
    ) => {
      return newOrder.map(id =>
        existing.find(ef => ef.__ref === `FolderResource:${id}`),
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

  const [sortedResources, setSortedResources] = useState(resources);

  useEffect(() => {
    setSortedResources(resources);
  }, [resources]);

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

  return (
    <BlockWrapper type={viewType}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={sortResourceIds}>
        <SortableContext
          items={sortedResources}
          strategy={verticalListSortingStrategy}>
          {resources.map((resource, index) => (
            <DraggableResource
              id={resource.id}
              key={resource.id}
              resource={resource}
              index={index}
              loading={loading}
              viewType={viewType}
              keyedData={keyedData}
              setResourceAction={setResourceAction}
            />
          ))}
        </SortableContext>
      </DndContext>
      {resourceAction && (
        <>
          <AddResourceToFolderModal
            defaultOpenFolder={selectedFolder}
            isOpen={resourceAction.action === 'add'}
            onClose={() => setResourceAction(undefined)}
            resource={{
              id: resourceAction.resource.resourceId,
              resourceType: resourceAction.resource.resourceType,
              path: resourceAction.resource.path,
            }}
          />
          <DeleteModal
            isOpen={resourceAction.action === 'delete'}
            onClose={() => setResourceAction(undefined)}
            onDelete={async () => {
              await onDeleteFolder(
                resourceAction.resource,
                resourceAction.index,
              );
              setResourceAction(undefined);
            }}
            description={t('myNdla.resource.confirmRemove')}
            title={t('myNdla.resource.removeTitle')}
            removeText={t('myNdla.resource.remove')}
          />
        </>
      )}
    </BlockWrapper>
  );
};

export default ResourceList;
