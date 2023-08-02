/*
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ButtonHTMLAttributes, forwardRef, useContext, useMemo } from 'react';
import { NoSSR } from '@ndla/util';
import { FavoriteButton as UIFavoriteButton } from '@ndla/button';
import { useFolders } from '../../containers/MyNdla/folderMutations';
import { getAllResources } from '../../util/folderHelpers';
import { AuthContext } from '../AuthenticationContext';
import config from '../../config';

interface Props
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'size' | 'type'> {
  path: string;
}

const ClientFavorite = forwardRef<HTMLButtonElement, Props>(
  ({ path, ...rest }, ref) => {
    const { authenticated } = useContext(AuthContext);
    const { folders } = useFolders({ skip: !authenticated });
    const resources = useMemo(() => getAllResources(folders), [folders]);
    const exists = resources.some((r) => r.path === path);
    return <UIFavoriteButton isFavorite={exists} {...rest} ref={ref} />;
  },
);

const FavoriteButton = forwardRef<HTMLButtonElement, Props>(
  (props: Props, ref) => {
    if (!config.feideEnabled) {
      return null;
    }
    return (
      <NoSSR fallback={<UIFavoriteButton />}>
        <ClientFavorite {...props} ref={ref} />
      </NoSSR>
    );
  },
);

export default FavoriteButton;
