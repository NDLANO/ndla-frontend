/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Spinner } from '@ndla/icons';
import { GQLFolder } from '../../../graphqlTypes';
import ErrorPage from '../../ErrorPage';

interface Props {
  folder?: GQLFolder;
  loading?: boolean;
}

const FolderMeta = ({ folder, loading }: Props) => {
  if (loading) {
    return <Spinner />;
  }
  if (!folder) {
    return <ErrorPage />;
  }

  return <div>{folder.name}</div>;
};

export default FolderMeta;
