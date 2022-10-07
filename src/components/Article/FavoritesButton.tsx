/*
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext, useMemo } from 'react';
import { NoSSR } from '@ndla/util';
import { FavoriteButton as UIFavoriteButton } from '@ndla/button';
import { useFolders } from '../../containers/MyNdla/folderMutations';
import { getAllResources } from '../../util/folderHelpers';
import { AuthContext } from '../AuthenticationContext';
import config from '../../config';

interface Props {
  path: string;
  onClick: () => void;
}

const ClientFavorite = ({ path, onClick }: Props) => {
  const { authenticated } = useContext(AuthContext);
  const { folders } = useFolders({ skip: !authenticated });
  const resources = useMemo(() => getAllResources(folders), [folders]);
  const exists = resources.some(r => r.path === path);
  return <UIFavoriteButton isFavorite={exists} onClick={onClick} />;
};

const FavoriteButton = ({ path, onClick }: Props) => {
  if (!config.feideEnabled) {
    return null;
  }
  return (
    <NoSSR fallback={<UIFavoriteButton />}>
      <ClientFavorite path={path} onClick={onClick} />
    </NoSSR>
  );
};

export default FavoriteButton;
