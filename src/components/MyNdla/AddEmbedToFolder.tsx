/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext, useMemo } from "react";
import { FavoriteButton } from "@ndla/button";
import { EmbedMetaData } from "@ndla/types-embed";
import { NoSSR } from "@ndla/util";
import { ResourceAttributes } from "./AddResourceToFolder";
import AddResourceToFolderModal from "./AddResourceToFolderModal";
import { useFolders } from "../../containers/MyNdla/folderMutations";
import { getAllResources } from "../../util/folderHelpers";
import { AuthContext } from "../AuthenticationContext";

interface Props {
  embed: Extract<EmbedMetaData, { status: "success" }>;
}

const embedToResource = (embed: Extract<EmbedMetaData, { status: "success" }>): ResourceAttributes | undefined => {
  switch (embed.resource) {
    case "audio":
      return {
        id: embed.data.id.toString(),
        resourceType: "audio",
        path: `/audio/${embed.data.id}`,
      };
    case "brightcove":
      return {
        id: embed.data.id.toString(),
        resourceType: "video",
        path: `/video/${embed.data.id}`,
      };
    case "image":
      return {
        id: embed.data.id.toString(),
        resourceType: "image",
        path: `/image/${embed.data.id}`,
      };
    case "concept":
      return {
        id: embed.data.concept.id.toString(),
        resourceType: "concept",
        path: `/concept/${embed.data.concept.id}`,
      };
    default:
      return undefined;
  }
};

const ClientAddEmbedToFolder = ({ embed }: Props) => {
  const { authenticated } = useContext(AuthContext);
  const resource = useMemo(() => embedToResource(embed), [embed]);
  const { folders } = useFolders({ skip: !authenticated });

  const exists = useMemo(() => {
    const resources = getAllResources(folders);
    return resources.some((r) => r.path === resource?.path);
  }, [folders, resource?.path]);

  if (!resource) {
    return null;
  }

  return (
    <AddResourceToFolderModal resource={resource}>
      <FavoriteButton isFavorite={exists} />
    </AddResourceToFolderModal>
  );
};

const AddEmbedToFolder = ({ embed }: Props) => {
  return (
    <NoSSR fallback={<FavoriteButton />}>
      <ClientAddEmbedToFolder embed={embed} />
    </NoSSR>
  );
};

export default AddEmbedToFolder;
