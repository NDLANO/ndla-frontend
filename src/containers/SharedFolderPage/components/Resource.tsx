/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  GQLFolderResource,
  GQLFolderResourceMetaSearchQuery,
} from '../../../graphqlTypes';

interface Props {
  resource: GQLFolderResource;
  meta?: GQLFolderResourceMetaSearchQuery['folderResourceMetaSearch'][0];
}

const Resource = ({ resource, meta }: Props) => {
  return <div>{meta?.title}</div>;
};

export default Resource;
