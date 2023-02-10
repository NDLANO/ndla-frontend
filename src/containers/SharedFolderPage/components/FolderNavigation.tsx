/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Spinner } from '@ndla/icons';
import {
  GQLFolder,
  GQLFolderResourceMetaSearchQuery,
} from '../../../graphqlTypes';
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
  if (loading) {
    return <Spinner />;
  }
  if (!folder) {
    return <div>error</div>;
  }

  return (
    <nav>
      <StyledUl>
        <Folder folder={folder} meta={meta} />
      </StyledUl>
    </nav>
  );
};

export default FolderNavigation;
