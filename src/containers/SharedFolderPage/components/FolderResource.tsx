/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import SafeLink from '@ndla/safelink';
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
    <li>
      <SafeLink to={`/folder/${rootFolderId}/${parentId}/${resource.id}`}>
        {meta?.title}
      </SafeLink>
    </li>
  );
};

export default FolderResource;
