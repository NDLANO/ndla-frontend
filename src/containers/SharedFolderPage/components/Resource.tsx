/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Spinner } from '@ndla/icons';
import {
  GQLFolderResource,
  GQLFolderResourceMetaSearchQuery,
} from '../../../graphqlTypes';

interface Props {
  resource: GQLFolderResource;
  meta?: GQLFolderResourceMetaSearchQuery['folderResourceMetaSearch'][0];
  loading?: boolean;
}

const Resource = ({ resource, meta, loading }: Props) => {
  if (loading) {
    return <Spinner />;
  }
  return <div>{meta?.title}</div>;
};

export default Resource;
