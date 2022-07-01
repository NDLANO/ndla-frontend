/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from '@apollo/client';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { AddButton, MenuButton } from '@ndla/button';
import { spacing } from '@ndla/core';
import { FolderOutlined } from '@ndla/icons/contentType';
import { FileDocumentOutline, Link } from '@ndla/icons/common';
import {
  ActionBreadcrumb,
  BlockResource,
  Folder,
  ListResource,
} from '@ndla/ui';
import { Pencil, Plus } from '@ndla/icons/action';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { DeleteForever } from '@ndla/icons/editor';
import { GQLFoldersPageQuery } from '../../../graphqlTypes';
import { useGraphQuery } from '../../../util/runQueries';
import ListViewOptions from './ListViewOptions';

const foldersPageQuery = gql`
  query foldersPage {
    folders(includeSubfolders: true, includeResources: true) {
      __typename
      id
      name
      parentId
      resources {
        id
        path
        tags
        resourceType
      }
    }
  }
`;

interface BlockWrapperProps {
  type?: string;
}

const FoldersPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  gap: ${spacing.xsmall};
  padding: ${spacing.small};
`;
const BlockWrapper = styled.div<BlockWrapperProps>`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xsmall};
  ${props =>
    props.type === 'block' &&
    css`
      display: grid;
      grid-template-columns: repeat(3, 2fr);
      gap: 25px 32px;
      margin-top: ${spacing.normal};
      div {
        max-width: 345px;
      }
    `};
`;

const ResourceCountContainer = styled.div`
  display: flex;
  gap: ${spacing.xsmall};
  align-items: center;
`;

const StyledRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

const getParentFolders = (
  selectedFolder: GQLFoldersPageQuery['folders'][0],
  allFolders: GQLFoldersPageQuery['folders'],
  parentFolders: GQLFoldersPageQuery['folders'],
): GQLFoldersPageQuery['folders'] => {
  if (!selectedFolder.parentId) return [selectedFolder, ...parentFolders];
  const parent = allFolders.find(f => f.id === selectedFolder.parentId)!;
  return getParentFolders(parent, allFolders, [
    selectedFolder,
    ...parentFolders,
  ]);
};

export type ViewType = 'list' | 'block' | 'listLarger';

const FoldersPage = () => {
  const { t } = useTranslation();
  const { folderId } = useParams();
  const [type, setType] = useState<ViewType>('list');
  const [isAdding, setIsAdding] = useState(false);
  const { data, loading } = useGraphQuery<GQLFoldersPageQuery>(
    foldersPageQuery,
  );

  const selectedFolder = useMemo(
    () => data?.folders.find(folder => folder.id === folderId),
    [folderId, data?.folders],
  );

  const folders = useMemo(
    () =>
      (selectedFolder
        ? data?.folders.filter(f => f.parentId === selectedFolder.id)
        : data?.folders.filter(f => !!!f.parentId)
      )?.map(folder => ({
        ...folder,
        directChildren: data?.folders.filter(f => f.parentId === folder.id),
      })),
    [selectedFolder, data?.folders],
  );

  const breadcrumbs = useMemo(
    () =>
      selectedFolder
        ? getParentFolders(selectedFolder, data?.folders ?? [], [])
        : [],
    [selectedFolder, data?.folders],
  );

  const Resource = type === 'block' ? BlockResource : ListResource;
  return (
    <FoldersPageContainer>
      <ActionBreadcrumb
        actionItems={[
          {
            icon: <Pencil />,
            text: 'Rediger',
            onClick: () => console.log('edit'),
          },
          {
            icon: <DeleteForever />,
            text: 'Slett',
            onClick: () => console.log('delete'),
            color: 'red',
          },
        ]}
        items={[
          { name: 'Mine mapper', to: '/minndla/folders' },
          ...breadcrumbs?.map(crumb => ({
            name: crumb.name,
            to: `/minndla/folders/${crumb.id}`,
          })),
        ]}></ActionBreadcrumb>
      {data && (
        <ResourceCountContainer>
          {folders && (
            <>
              <FolderOutlined />
              <span>{t('myNdla.folders', { count: folders.length })}</span>
            </>
          )}
          {selectedFolder && (
            <>
              <FileDocumentOutline />
              <span>
                {t('myNdla.resources', {
                  count: selectedFolder.resources.length,
                })}
              </span>
            </>
          )}
        </ResourceCountContainer>
      )}
      <StyledRow>
        <AddButton
          size="xsmall"
          aria-label={t('myNdla.newFolder')}
          ghostPill
          onClick={() => console.log('add')}>
          <Plus />
          <p>{t('myNdla.newFolder')}</p>
        </AddButton>
        <ListViewOptions type={type} onTypeChange={setType} />
      </StyledRow>
      {folders && (
        <BlockWrapper type={type}>
          {folders.map(folder => (
            <Folder
              link={`/minndla/folders/${folder.id}`}
              title={folder.name}
              type={type === 'block' ? 'block' : 'list'}
              subFolders={folder.directChildren?.length}
              subResources={folder.resources.length}
              actionMenu={<div>Test</div>}
            />
          ))}
        </BlockWrapper>
      )}
      {selectedFolder && (
        <BlockWrapper type={type}>
          {selectedFolder.resources.map(resource => (
            <Resource
              resourceImage={{ alt: '', src: '' }}
              link={`/${resource.path}`}
              tags={resource.tags}
              topics={[resource.resourceType]}
              title={resource.id}
              description={type !== 'list' ? 'Beskrivelse' : undefined}
              actionMenu={
                <MenuButton
                  menuItems={[
                    {
                      icon: <FolderOutlined />,
                      text: 'Legg til mappe/tag',
                      onClick: () => console.log('add'),
                    },
                    {
                      icon: <Link />,
                      text: 'Kopier lenke til siden',
                      onClick: () => console.log('copy'),
                    },
                    {
                      icon: <DeleteForever />,
                      text: 'Fjern',
                      onClick: () => console.log('delete'),
                      color: 'red',
                    },
                  ]}
                />
              }
            />
          ))}
        </BlockWrapper>
      )}
    </FoldersPageContainer>
  );
};

export default FoldersPage;
