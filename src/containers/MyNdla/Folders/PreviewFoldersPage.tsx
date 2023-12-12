/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useContext, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import FolderActions from './FolderActions';
import FolderButtons from './FolderButtons';
import { ViewType } from './FoldersPage';
import { AuthContext } from '../../../components/AuthenticationContext';
import { STORED_RESOURCE_VIEW_SETTINGS } from '../../../constants';
import { GQLFolder, GQLFoldersPageQuery } from '../../../graphqlTypes';
import { useGraphQuery } from '../../../util/runQueries';
import SharedFolderPage from '../../SharedFolderPage/SharedFolderPage';
import MyNdlaPageWrapper from '../components/MyNdlaPageWrapper';
import { foldersPageQuery, useFolder } from '../folderMutations';

const PreviewFoldersPage = () => {
  const { folderId } = useParams();
  const { examLock } = useContext(AuthContext);
  const selectedFolder = useFolder(folderId);
  const [viewType, _setViewType] = useState<ViewType>(
    (localStorage.getItem(STORED_RESOURCE_VIEW_SETTINGS) as ViewType) || 'list',
  );
  const { data } = useGraphQuery<GQLFoldersPageQuery>(foldersPageQuery);

  const folders: GQLFolder[] = useMemo(
    () =>
      selectedFolder
        ? selectedFolder.subfolders
        : (data?.folders as GQLFolder[]) ?? [],
    [selectedFolder, data?.folders],
  );
  const [_focusId, setFocusId] = useState<string | undefined>(undefined);

  const setViewType = useCallback((type: ViewType) => {
    _setViewType(type);
    localStorage.setItem(STORED_RESOURCE_VIEW_SETTINGS, type);
  }, []);

  const dropDownMenu = useMemo(
    () => (
      <FolderActions
        selectedFolder={selectedFolder}
        setFocusId={setFocusId}
        folders={folders}
        inToolbar
      />
    ),
    [selectedFolder, folders, setFocusId],
  );

  const folderButtons = useMemo(
    () => (
      <FolderButtons selectedFolder={selectedFolder} setFocusId={setFocusId} />
    ),
    [selectedFolder, setFocusId],
  );

  return (
    <MyNdlaPageWrapper
      dropDownMenu={dropDownMenu}
      buttons={folderButtons}
      viewType={viewType}
      onViewTypeChange={setViewType}
      showButtons={!examLock || !!selectedFolder}
    >
      <SharedFolderPage />
    </MyNdlaPageWrapper>
  );
};

export default PreviewFoldersPage;
