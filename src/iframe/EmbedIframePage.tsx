/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import PostResizeMessage from "./PostResizeMessage";
import Scripts from "../components/Scripts/Scripts";
import { NotFoundPage } from "../containers/NotFoundPage/NotFoundPage";
import ResourceEmbed, { StandaloneEmbed } from "../containers/ResourceEmbed/components/ResourceEmbed";

interface Props {
  embedId?: string;
  embedType?: string;
}

const supportedEmbedTypes: StandaloneEmbed[] = ["concept", "video", "audio", "image", "h5p"];
const EmbedIframePage = ({ embedId, embedType }: Props) => {
  if (embedId && supportedEmbedTypes.some((t) => t === embedType)) {
    return (
      <>
        <Scripts />
        <PostResizeMessage />
        <ResourceEmbed id={embedId} type={embedType as StandaloneEmbed} isOembed />
      </>
    );
  }

  return <NotFoundPage />;
};

export default EmbedIframePage;
