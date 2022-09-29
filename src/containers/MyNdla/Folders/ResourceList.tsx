/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Dictionary, isEqual, keyBy } from 'lodash';
import { useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from '@ndla/icons/common';
import { FolderOutlined } from '@ndla/icons/contentType';
import { DeleteForever } from '@ndla/icons/editor';
import { BlockResource, ListResource, MakeDNDList, useSnack } from '@ndla/ui';
import {
  DraggableProvidedDragHandleProps,
  DropResult,
} from 'react-beautiful-dnd';
import { useApolloClient } from '@apollo/client';
import AddResourceToFolderModal from '../../../components/MyNdla/AddResourceToFolderModal';
import config from '../../../config';
import {
  GQLFolder,
  GQLFolderResource,
  GQLFolderResourceMeta,
} from '../../../graphqlTypes';
import DeleteModal from '../components/DeleteModal';
import {
  useDeleteFolderResourceMutation,
  useFolderResourceMetaSearch,
  useSortResourcesMutation,
} from '../folderMutations';
import { BlockWrapper, ListItem, ViewType } from './FoldersPage';
import { usePrevious } from '../../../util/utilityHooks';
import { contentTypeMapping } from '../../../util/getContentType';

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

interface DraggableResourceProps {
  id: string;
  resource: GQLFolderResource;
  index: number;
  loading: boolean;
  viewType: ViewType;
  setResourceAction: (action: ResourceAction | undefined) => void;
  dragHandleProps?: DraggableProvidedDragHandleProps;
  keyedData: Dictionary<GQLFolderResourceMeta>;
}

const DraggableResource = ({
  resource,
  index,
  loading,
  viewType,
  setResourceAction,
  dragHandleProps,
  keyedData,
}: DraggableResourceProps) => {
  const { t } = useTranslation();
  const { addSnack } = useSnack();
  const Resource = viewType === 'block' ? BlockResource : ListResource;
  const resourceMeta =
    keyedData[`${resource.resourceType}-${resource.resourceId}`];
  const resourceTypeId = resourceMeta?.resourceTypes?.[0]?.id ?? '';
  const contentType = contentTypeMapping[resourceTypeId] ?? '';
  return (
    <ListItem
      key={`resource-${resource.id}`}
      id={`resource-${resource.id}`}
      tabIndex={-1}
      {...dragHandleProps}>
      <Resource
        contentType={contentType}
        id={resource.id}
        tagLinkPrefix="/minndla/tags"
        isLoading={loading}
        key={resource.id}
        resourceImage={{
          src: resourceMeta?.metaImage?.url ?? '',
          alt: '',
        }}
        link={resource.path}
        tags={resource.tags}
        topics={resourceMeta?.resourceTypes.map(rt => rt.name) ?? []}
        title={resourceMeta?.title ?? ''}
        description={
          viewType !== 'list' ? resourceMeta?.description ?? '' : undefined
        }
        menuItems={[
          {
            icon: <FolderOutlined />,
            text: t('myNdla.resource.add'),
            onClick: () => setResourceAction({ action: 'add', resource }),
          },
          {
            icon: <Link />,
            text: t('myNdla.resource.copyLink'),
            onClick: () => {
              navigator.clipboard.writeText(
                `${config.ndlaFrontendDomain}${resource.path}`,
              );
              addSnack({
                content: t('myNdla.resource.linkCopied'),
                id: 'linkCopied',
              });
            },
          },
          {
            icon: <DeleteForever />,
            text: t('myNdla.resource.remove'),
            onClick: () =>
              setResourceAction({ action: 'delete', resource, index }),
            type: 'danger',
          },
        ]}
      />
    </ListItem>
  );
};

const moveIndexToNewIndex = <T,>(
  array: T[],
  oldIdx: number,
  newIdx: number,
): T[] | null => {
  const copy = [...array];
  const toMove = copy[oldIdx];
  if (!toMove) return null;

  copy.splice(oldIdx, 1); // Remove moved item from list
  copy.splice(newIdx, 0, toMove); // Insert removed item to new location
  return copy;
};

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
        () => document.getElementById(`resource-${focusId}`)?.focus(),
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

  async function sortResourceIds(dropResult: DropResult, parentId: string) {
    const sourceIdx = dropResult.source.index;
    const destinationIdx = dropResult.destination?.index;
    if (destinationIdx === undefined) return;

    const originalIds = resources.map(f => f.id);
    const ids = moveIndexToNewIndex(originalIds, sourceIdx, destinationIdx);
    if (ids === null) return;

    const updateCache = (newOrder: string[]) => {
      const sortCacheModifierFunction = (
        existing: (GQLFolder & { __ref: string })[],
      ) => {
        return newOrder.map(id =>
          existing.find(ef => ef.__ref === `FolderResource:${id}`),
        );
      };

      if (parentId) {
        client.cache.modify({
          id: client.cache.identify({
            __ref: `Folder:${parentId}`,
          }),
          fields: { resources: sortCacheModifierFunction },
        });
      }
    };

    updateCache(ids);

    return sortResources({
      variables: {
        sortedIds: ids,
        parentId,
      },
    }).catch(() => updateCache(originalIds));
  }

  return (
    <>
      <BlockWrapper type={viewType}>
        <MakeDNDList
          disableDND={viewType === 'block'}
          onDragEnd={result => sortResourceIds(result, selectedFolder.id)}
          dragHandle={true}
          dndContextId={'resource-dnd'}>
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
        </MakeDNDList>
        {resourceAction && (
          <>
            <AddResourceToFolderModal
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
    </>
  );
};

export default ResourceList;
