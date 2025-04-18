/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ButtonHTMLAttributes, type Ref, useContext, useMemo } from "react";
import { NoSSR } from "@ndla/util";
import UIFavoriteButton from "../../components/MyNdla/FavoriteButton";
import { useFolders } from "../../mutations/folderMutations";
import { getAllResources } from "../../util/folderHelpers";
import { AuthContext } from "../AuthenticationContext";

interface Props extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "size" | "type"> {
  ref?: Ref<HTMLButtonElement>;
  path: string;
}

const ClientFavorite = ({ path, ...rest }: Props) => {
  const { authenticated } = useContext(AuthContext);
  const { folders } = useFolders({ skip: !authenticated });
  const resources = useMemo(() => getAllResources(folders), [folders]);
  const exists = resources.some((r) => r.path === path);
  return <UIFavoriteButton isFavorite={exists} {...rest} />;
};

const FavoriteButton = (props: Props) => {
  return (
    <NoSSR fallback={<UIFavoriteButton />}>
      <ClientFavorite {...props} />
    </NoSSR>
  );
};

export default FavoriteButton;
