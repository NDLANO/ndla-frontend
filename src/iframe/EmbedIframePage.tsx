/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useParams } from "react-router";
import PostResizeMessage from "./PostResizeMessage";
import { NotFoundPage } from "../containers/NotFoundPage/NotFoundPage";
import ResourceEmbed, { StandaloneEmbed } from "../containers/ResourceEmbed/components/ResourceEmbed";

const supportedEmbedTypes: StandaloneEmbed[] = ["concept", "video", "audio", "image", "h5p"];
const EmbedIframePage = () => {
  const { embedId, embedType } = useParams();
  if (embedId && supportedEmbedTypes.some((t) => t === embedType)) {
    return (
      <>
        <PostResizeMessage />
        <ResourceEmbed id={embedId} type={embedType as StandaloneEmbed} isOembed />
      </>
    );
  }

  return <NotFoundPage />;
};

export default EmbedIframePage;
