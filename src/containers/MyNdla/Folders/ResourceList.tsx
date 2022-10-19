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
import { Link } from '@ndla/icons/common';
import { FolderOutlined } from '@ndla/icons/contentType';
import { DeleteForever } from '@ndla/icons/editor';
import { BlockResource, ListResource, useSnack } from '@ndla/ui';
import AddResourceToFolderModal from '../../../components/MyNdla/AddResourceToFolderModal';
import config from '../../../config';
import { GQLFolder, GQLFolderResource } from '../../../graphqlTypes';
import DeleteModal from '../components/DeleteModal';
import {
  useDeleteFolderResourceMutation,
  useFolderResourceMetaSearch,
} from '../folderMutations';
import { BlockWrapper, ListItem, ViewType } from './FoldersPage';
import { usePrevious } from '../../../util/utilityHooks';

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

  const Resource = viewType === 'block' ? BlockResource : ListResource;

  return (
    <>
      <BlockWrapper type={viewType}>
        {resources.map((resource, index) => {
          const resourceMeta =
            keyedData[`${resource.resourceType}-${resource.resourceId}`];
          return (
            <ListItem
              key={`resource-${resource.id}`}
              id={`resource-${resource.id}`}
              tabIndex={-1}>
              <Resource
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
                resourceTypes={resourceMeta?.resourceTypes ?? []}
                title={resourceMeta?.title ?? ''}
                description={
                  viewType !== 'list'
                    ? resourceMeta?.description ?? ''
                    : undefined
                }
                menuItems={[
                  {
                    icon: <FolderOutlined />,
                    text: t('myNdla.resource.add'),
                    onClick: () =>
                      setResourceAction({ action: 'add', resource }),
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
        })}
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
    </>
  );
};

export default ResourceList;
