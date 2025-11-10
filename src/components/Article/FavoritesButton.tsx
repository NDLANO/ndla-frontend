/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ButtonHTMLAttributes, type Ref, useContext, useMemo } from "react";
import { FavoriteButton as UIFavoriteButton } from "../../components/MyNdla/FavoriteButton";
import { useFolders } from "../../mutations/folder/folderQueries";
import { getAllResources } from "../../util/folderHelpers";
import { AuthContext } from "../AuthenticationContext";

interface Props extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "size" | "type"> {
  ref?: Ref<HTMLButtonElement>;
  path: string;
}

export const FavoriteButton = (props: Props) => {
  const { authenticated } = useContext(AuthContext);
  const { folders } = useFolders({ skip: !authenticated });
  const resources = useMemo(() => getAllResources(folders), [folders]);
  const exists = resources.some((r) => r.path === props.path);
  return <UIFavoriteButton isFavorite={exists} {...props} />;
};
