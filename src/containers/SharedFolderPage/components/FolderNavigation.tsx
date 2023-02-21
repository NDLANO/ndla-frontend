/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Spinner } from '@ndla/icons';
import { useParams } from 'react-router-dom';
import {
  GQLFolder,
  GQLFolderResourceMetaSearchQuery,
} from '../../../graphqlTypes';
import useArrowNavigation from '../../Masthead/drawer/useArrowNavigation';
import Folder, { StyledUl } from './Folder';

interface Props {
  folder?: GQLFolder;
  loading: boolean;
  meta: Record<
    string,
    GQLFolderResourceMetaSearchQuery['folderResourceMetaSearch'][0]
  >;
}

const FolderNavigation = ({ folder, meta, loading }: Props) => {
  const { subfolderId, resourceId, folderId } = useParams();

  const defaultSelected =
    subfolderId && resourceId
      ? `shared-${subfolderId}-${resourceId}`
      : `shared-${folderId}`;

  useArrowNavigation(!!(!loading && folder), {
    multilevel: true,
    initialSelected: defaultSelected,
  });

  if (loading) {
    return <Spinner />;
  }

  if (!folder) {
    return <div>error</div>;
  }

  return (
    <nav>
      <StyledUl role="tree" data-list>
        <Folder
          folder={folder}
          meta={meta}
          defaultOpenFolder={subfolderId!}
          root
        />
      </StyledUl>
    </nav>
  );
};

export default FolderNavigation;
