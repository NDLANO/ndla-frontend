/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useQuery } from "@apollo/client/react";
import { ButtonHTMLAttributes, type Ref, useContext } from "react";
import { FavoriteButton as UIFavoriteButton } from "../../components/MyNdla/FavoriteButton";
import { resourceConnectionsQuery } from "../../mutations/folder/folderQueries";
import { AuthContext } from "../AuthenticationContext";

interface Props extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "size" | "type"> {
  ref?: Ref<HTMLButtonElement>;
  path: string;
}

export const FavoriteButton = (props: Props) => {
  const { authenticated } = useContext(AuthContext);
  const connectionsQuery = useQuery(resourceConnectionsQuery, {
    skip: !authenticated,
    variables: { path: props.path },
  });
  return <UIFavoriteButton isFavorite={!!connectionsQuery.data?.myNdlaResourceConnections?.length} {...props} />;
};
