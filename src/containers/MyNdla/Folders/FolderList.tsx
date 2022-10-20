/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Spinner } from '@ndla/icons';
import { DeleteForever } from '@ndla/icons/editor';
import { Pencil } from '@ndla/icons/action';
import { FolderOutlined } from '@ndla/icons/contentType';
import { Folder } from '@ndla/ui';
import styled from '@emotion/styled';
import { colors, spacing } from '@ndla/core';
import { Dispatch, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { BlockWrapper, FolderAction, ListItem, ViewType } from './FoldersPage';
import WhileLoading from '../../../components/WhileLoading';
import NewFolder from '../../../components/MyNdla/NewFolder';
import { GQLFolder } from '../../../graphqlTypes';
import {
  FolderTotalCount,
  getTotalCountForFolder,
} from '../../../util/folderHelpers';

const StyledFolderIcon = styled.span`
  display: flex;
  padding: ${spacing.small};
  svg {
    color: ${colors.brand.primary};
    height: 20px;
    width: 20px;
  }
`;

interface Props {
  loading: boolean;
  type: ViewType;
  folders: GQLFolder[];
  isAdding: boolean;
  onFolderAdd: (folder: GQLFolder) => Promise<void>;
  folderId: string | undefined;
  setIsAdding: Dispatch<boolean>;
  setFolderAction: Dispatch<FolderAction | undefined>;
}

const FolderList = ({
  loading,
  type,
  folders,
  isAdding,
  setIsAdding,
  onFolderAdd,
  folderId,
  setFolderAction,
}: Props) => {
  const { t } = useTranslation();
  const foldersCount = useMemo(
    () =>
      folders?.reduce<Record<string, FolderTotalCount>>((acc, curr) => {
        acc[curr.id] = getTotalCountForFolder(curr);
        return acc;
      }, {}),
    [folders],
  );

  return (
    <WhileLoading isLoading={loading} fallback={<Spinner />}>
      {folders && (
        <BlockWrapper type={type}>
          {isAdding && (
            <NewFolder
              icon={
                <StyledFolderIcon>
                  <FolderOutlined />
                </StyledFolderIcon>
              }
              parentId={folderId ?? 'folders'}
              onClose={() => setIsAdding(false)}
              onCreate={onFolderAdd}
            />
          )}
          {folders.map((folder, index) => (
            <ListItem
              key={`folder-${index}`}
              id={`folder-${folder.id}`}
              tabIndex={-1}>
              <Folder
                key={folder.id}
                id={folder.id}
                link={`/minndla/folders/${folder.id}`}
                title={folder.name}
                type={type}
                subFolders={foldersCount[folder.id]?.folders}
                subResources={foldersCount[folder.id]?.resources}
                menuItems={[
                  {
                    icon: <Pencil />,
                    text: t('myNdla.folder.edit'),
                    onClick: () =>
                      setFolderAction({ action: 'edit', folder, index }),
                  },
                  {
                    icon: <DeleteForever />,
                    text: t('myNdla.folder.delete'),
                    onClick: () =>
                      setFolderAction({ action: 'delete', folder, index }),
                    type: 'danger',
                  },
                ]}
              />
            </ListItem>
          ))}
        </BlockWrapper>
      )}
    </WhileLoading>
  );
};
export default FolderList;
