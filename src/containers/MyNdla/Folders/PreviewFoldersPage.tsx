/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useState } from 'react';
import { ViewType } from './FoldersPage';
import { STORED_RESOURCE_VIEW_SETTINGS } from '../../../constants';
import SharedFolderPage from '../../SharedFolderPage/SharedFolderPage';
import MyNdlaPageWrapper from '../components/MyNdlaPageWrapper';

const PreviewFoldersPage = () => {
  const [viewType, _setViewType] = useState<ViewType>(
    (localStorage.getItem(STORED_RESOURCE_VIEW_SETTINGS) as ViewType) || 'list',
  );

  const setViewType = useCallback((type: ViewType) => {
    _setViewType(type);
    localStorage.setItem(STORED_RESOURCE_VIEW_SETTINGS, type);
  }, []);

  return (
    <MyNdlaPageWrapper viewType={viewType} onViewTypeChange={setViewType}>
      <SharedFolderPage />
    </MyNdlaPageWrapper>
  );
};

export default PreviewFoldersPage;
