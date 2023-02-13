/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { SafeLinkButton } from '@ndla/safelink';
import { useParams } from 'react-router-dom';
import {
  GQLFolderResource,
  GQLFolderResourceMetaSearchQuery,
} from '../../../graphqlTypes';

interface Props {
  parentId: string;
  meta?: GQLFolderResourceMetaSearchQuery['folderResourceMetaSearch'][0];
  resource: GQLFolderResource;
}

const FolderResource = ({ parentId, resource, meta }: Props) => {
  const { folderId: rootFolderId } = useParams();
  return (
    <li role="none" data-list-item>
      <SafeLinkButton
        tabIndex={-1}
        id={`resource-${parentId}-${resource.resourceId}`}
        role="treeitem"
        variant="ghost"
        to={`/folder/${rootFolderId}/${parentId}/${resource.id}`}>
        {meta?.title}
      </SafeLinkButton>
    </li>
  );
};

export default FolderResource;
