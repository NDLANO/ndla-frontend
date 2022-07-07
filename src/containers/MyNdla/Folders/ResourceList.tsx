/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from '@ndla/icons/common';
import { FolderOutlined } from '@ndla/icons/contentType';
import { DeleteForever } from '@ndla/icons/editor';
import { BlockResource, ListResource } from '@ndla/ui';
import { copyTextToClipboard } from '@ndla/util';
import config from '../../../config';
import { GQLFolder, GQLFolderResource } from '../../../graphqlTypes';
import { BlockWrapper, ViewType } from './FoldersPage';
import { useDeleteFolderResourceMutation } from '../folderMutations';
import AddResourceToFolderModal from '../../../components/MyNdla/AddResourceToFolderModal';
import DeleteModal from '../components/DeleteModal';

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
  const [resourceAction, setResourceAction] = useState<
    ResourceAction | undefined
  >(undefined);

  const { deleteFolderResource } = useDeleteFolderResourceMutation(
    selectedFolder.id,
  );

  const Resource = viewType === 'block' ? BlockResource : ListResource;

  return (
    <>
      <BlockWrapper type={viewType}>
        {selectedFolder.resources.map(resource => (
          <Resource
            key={resource.id}
            resourceImage={{ alt: '', src: '' }}
            link={`${resource.path}`}
            tags={resource.tags}
            topics={[resource.resourceType]}
            title={resource.id}
            description={viewType !== 'list' ? 'Beskrivelse' : undefined}
            menuItems={[
              {
                icon: <FolderOutlined />,
                text: t('myNdla.resource.add'),
                onClick: () => setResourceAction({ action: 'add', resource }),
              },
              {
                icon: <Link />,
                text: t('myNdla.resource.copyLink'),
                onClick: () =>
                  copyTextToClipboard(
                    `${config.ndlaFrontendDomain}${resource.path}`,
                  ),
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
        ))}
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
              resourceComponent={
                <ListResource
                  key={resourceAction.resource.id}
                  title={resourceAction.resource.id.toString()}
                  resourceImage={{ src: '', alt: '' }}
                  topics={[resourceAction.resource.resourceType]}
                  link={''}
                />
              }
            />
            <DeleteModal
              isOpen={resourceAction.action === 'delete'}
              onClose={() => setResourceAction(undefined)}
              onDelete={() =>
                deleteFolderResource({
                  variables: {
                    folderId,
                    resourceId: resourceAction.resource.id,
                  },
                })
              }
              description={t('myNdla.resource.confirmDelete')}
              title={t('myNdla.resource.delete')}
            />
          </>
        )}
      </BlockWrapper>
    </>
  );
};

export default ResourceList;
