/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { keyBy } from 'lodash';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from '@ndla/icons/common';
import { FolderOutlined } from '@ndla/icons/contentType';
import { DeleteForever } from '@ndla/icons/editor';
import { BlockResource, ListResource, useSnack } from '@ndla/ui';
import { copyTextToClipboard } from '@ndla/util';
import AddResourceToFolderModal from '../../../components/MyNdla/AddResourceToFolderModal';
import config from '../../../config';
import { GQLFolder, GQLFolderResource } from '../../../graphqlTypes';
import DeleteModal from '../components/DeleteModal';
import {
  useDeleteFolderResourceMutation,
  useFolderResourceMetaSearch,
} from '../folderMutations';
import { BlockWrapper, ViewType } from './FoldersPage';

interface Props {
  selectedFolder: GQLFolder;
  viewType: ViewType;
  folderId: string;
}

export type ResourceActionType = 'add' | 'delete';
interface ResourceAction {
  action: ResourceActionType;
  resource: GQLFolderResource;
}

const ResourceList = ({ selectedFolder, viewType, folderId }: Props) => {
  const { t } = useTranslation();
  const { addSnack } = useSnack();
  const [resourceAction, setResourceAction] = useState<
    ResourceAction | undefined
  >(undefined);

  const { data, loading } = useFolderResourceMetaSearch(
    selectedFolder.resources.map(r => ({
      id: r.resourceId,
      path: r.path,
      resourceType: r.resourceType,
    })),
  );

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
        {selectedFolder.resources.map(resource => {
          const resourceMeta =
            keyedData[`${resource.resourceType}-${resource.resourceId}`];
          return (
            <Resource
              isLoading={loading}
              key={resource.id}
              resourceImage={{
                src: resourceMeta?.metaImage?.url ?? '',
                alt: resourceMeta?.metaImage?.url ?? '',
              }}
              link={resource.path}
              tags={resource.tags}
              topics={resourceMeta?.resourceTypes.map(rt => rt.name) ?? []}
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
                  onClick: () => setResourceAction({ action: 'add', resource }),
                },
                {
                  icon: <Link />,
                  text: t('myNdla.resource.copyLink'),
                  onClick: () => {
                    copyTextToClipboard(
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
                    setResourceAction({ action: 'delete', resource }),
                  type: 'danger',
                },
              ]}
            />
          );
        })}
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
                await deleteFolderResource({
                  variables: {
                    folderId,
                    resourceId: resourceAction.resource.id,
                  },
                });
                addSnack({
                  id: `removedFromFolder${selectedFolder.id}`,
                  content: t('myNdla.resource.removedFromFolder', {
                    folderName: selectedFolder.name,
                  }),
                });
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
